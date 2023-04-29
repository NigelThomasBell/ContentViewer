import { useState, useMemo, useEffect } from 'react';
const fs = window.require('fs');
const pathModule = window.require('path');
const { app, dialog } = window.require('@electron/remote');
import DirectorySelector from './sidebar-components/DirectorySelector';
import TableOfContents from './sidebar-components/TableOfContents';
import FileExplorer from './sidebar-components/FileExplorer';
import errorFolderNotFoundPage from './../pages/error-folder-not-found.html?url';
import errorFileNotFoundPage from './../pages/error-file-not-found.html?url';
import redirectedToClosestParentPage from './../pages/redirected-to-closest-parent.html?url';

const SidebarSection = () => {
  const onBack = () => {
    path = pathModule.dirname(path);
    setPath(path);
  };
  const importDirectory = () => {
    dialog
      .showOpenDialog({
        title: 'Import Directory',
        properties: ['openDirectory']
      })
      .then((folderChosen) => {
        if (folderChosen.filePaths[0] !== undefined) {
          document.getElementById('current-folder-directory').textContent = folderChosen.filePaths[0];
          setPath(folderChosen.filePaths[0]);
          highlightSelectedRow(null);
        }
      });
  };
  const onOpen = (content, isDirectory = false) => {
    let path = document.getElementById('current-folder-directory').textContent;
    const fullPath = pathModule.join(path, content);
    if (isDirectory) {
      if (fs.existsSync(fullPath)) {
        setPath(fullPath);
        highlightSelectedRow(null);
      } else {
        document.getElementById('page-iframe').src = errorFolderNotFoundPage;
      }
    } else {
      if (fs.existsSync(fullPath)) {
        document.getElementById('page-iframe').src = fullPath;
      } else {
        document.getElementById('page-iframe').src = errorFileNotFoundPage;
      }
    }
  };
  const highlightSelectedRow = (id) => {
    if (id === null) {
      const selectedRow = document.getElementsByClassName('selected');
      if (selectedRow.length > 0) {
        selectedRow[0].classList.remove('selected');
      }
    } else {
      const row = document.getElementById(id);
      const elements = document.querySelectorAll('tr.selected, li.clickable.selected');
      elements.forEach((elem) => {
        elem.classList.remove('selected');
      });
      row.classList.add('selected');
    }
  };
  // Getting the path and then redirecting if required.
  let [path, setPath] = useState(app.getAppPath());
  let isRedirected = false;
  while (!fs.existsSync(path)) {
    isRedirected = true;
    path = pathModule.dirname(path);
  }
  if (isRedirected) {
    document.getElementById('page-iframe').src = redirectedToClosestParentPage;
  }
  // Side effect code for moving between the files in the currently open folder/records in the currently open table of contents. Movement is done with the up and down arrow keys.
  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowDown'].indexOf(event.code) > -1) {
        event.preventDefault();
      }
      const currentSelectedRow = document.getElementsByClassName('selected');
      const sidebarContent = document.getElementsByClassName('sidebar-content');
      // If the file explorer is enabled.
      if (sidebarContent[0].classList.contains('active')) {
        const filesCollection = document.getElementsByClassName('file');
        const fileNames = [];
        for (let i = 0; i < filesCollection.length; i++) {
          fileNames.push(filesCollection[i].getElementsByTagName('td')[1].textContent);
        }
        if (currentSelectedRow.length !== 0 && filesCollection.length > 0) {
          let i = fileNames.indexOf(currentSelectedRow[0].getElementsByTagName('td')[1].textContent);
          let contentName = '';
          switch (event.key) {
            case 'ArrowUp':
              if (i === 0) {
                i = filesCollection.length - 1;
              } else {
                i = i - 1;
              }
              contentName = filesCollection[i].getElementsByTagName('td')[1].textContent;
              onOpen(contentName, false);
              highlightSelectedRow(filesCollection[i].id);
              break;
            case 'ArrowDown':
              if (i === filesCollection.length - 1) {
                i = 0;
              } else {
                i = i + 1;
              }
              contentName = filesCollection[i].getElementsByTagName('td')[1].textContent;
              onOpen(contentName, false);
              highlightSelectedRow(filesCollection[i].id);
              break;
            default:
              break;
          }
        }
      }
      // If the table of contents is enabled.
      if (sidebarContent[1].classList.contains('active')) {
        const recordsCollection = document.getElementsByClassName('clickable-record');
        const recordNames = [];
        for (let i = 0; i < recordsCollection.length; i++) {
          recordNames.push(recordsCollection[i].innerHTML);
        }
        if (currentSelectedRow.length !== 0 && recordsCollection.length > 0) {
          let i = recordNames.indexOf(currentSelectedRow[0].innerHTML);
          let contentName = '';
          switch (event.key) {
            case 'ArrowUp':
              if (i === 0) {
                i = recordsCollection.length - 1;
              } else {
                i = i - 1;
              }
              contentName = recordsCollection[i].getAttribute('data-record-link');
              onOpen(contentName, false);
              highlightSelectedRow(recordsCollection[i].id);
              break;
            case 'ArrowDown':
              if (i === recordsCollection.length - 1) {
                i = 0;
              } else {
                i = i + 1;
              }
              contentName = recordsCollection[i].getAttribute('data-record-link');
              onOpen(contentName, false);
              highlightSelectedRow(recordsCollection[i].id);
              break;
            default:
              break;
          }
        }
      }
    });
  }, []);
  return (
    <aside id="sidebar-section">
      <SidebarFileExplorer path={path} onBack={onBack} importDirectory={importDirectory} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} />
      <SidebarTableOfContents path={path} onBack={onBack} importDirectory={importDirectory} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} />
    </aside>
  );
};
const SidebarFileExplorer = ({ path, onBack, importDirectory, onOpen, highlightSelectedRow }) => {
  const formatFileSize = (size) => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB'][i];
  };
  const collectContentArrays = (foldersArray, filesArray) => {
    for (let i = 0; i < contents.length; i++) {
      switch (contents[i].isDirectory) {
        case true:
          foldersArray.push(contents[i]);
          break;
        case false:
          filesArray.push(contents[i]);
          break;
        default:
          break;
      }
    }
  };
  // Collect an initial list of contents from the currently open directory.
  let i = 0;
  const initialContents = useMemo(
    () =>
      fs
        .readdirSync(path)
        .filter((file) => {
          try {
            fs.statSync(pathModule.join(path, file));
            return true;
          } catch (error) {
            return false;
          }
        })
        .sort((a, b) =>
          a.localeCompare(b, navigator.languages[0] || navigator.language, {
            numeric: true,
            ignorePunctuation: false
          })
        )
        .map((file) => {
          const stats = fs.statSync(pathModule.join(path, file));
          return {
            id: i++,
            name: file,
            size: stats.isFile() ? (stats.size !== 0 ? formatFileSize(stats.size) : '0 B') : null,
            isDirectory: stats.isDirectory()
          };
        }),
    [path, i]
  );
  // Get a refined list of contents based on the search input and sorting options chosen.
  const [searchString, setSearchString] = useState('');
  let contents = initialContents.filter((s) => s.name.includes(searchString));
  const [sortType, setSortType] = useState('folders-first');
  const [sortDirection, setSortDirection] = useState('ascending');
  if (sortType !== null) {
    switch (sortType) {
      case 'folders-first':
        contents = [...contents].sort((a, b) => b['isDirectory'] - a['isDirectory']);
        break;
      case 'files-first':
        contents = [...contents].sort((a, b) => !b['isDirectory'] - !a['isDirectory']);
        break;
      case 'alphabetical':
        contents = [...contents].sort((a, b) => a['id'] - b['id']);
        break;
      default:
        break;
    }
  }
  const foldersArray = [];
  const filesArray = [];
  if (sortDirection !== null) {
    switch (sortDirection) {
      case 'ascending':
        contents = contents.sort();
        break;
      case 'descending':
        switch (sortType) {
          case 'folders-first':
            collectContentArrays(foldersArray, filesArray);
            contents = foldersArray.reverse().concat(filesArray.reverse());
            break;
          case 'files-first':
            collectContentArrays(foldersArray, filesArray);
            contents = filesArray.reverse().concat(foldersArray.reverse());
            break;
          case 'alphabetical':
            contents = contents.reverse();
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
  return (
    <div id="sidebarFileExplorer" className="sidebar-content active">
      <DirectorySelector path={path} onBack={onBack} importDirectory={importDirectory} />
      <div className="form-group mt-4 mb-2">
        <input className="form-control form-control-sm" onChange={(event) => setSearchString(event.target.value)} value={searchString} placeholder="Search..." />
        <div className="sort-option">
          <label>Sort contents:</label>
          <select id="sort-by-options" className="sort-selector" onChange={(event) => setSortType(event.target.value)}>
            <option value="folders-first">Folders First</option>
            <option value="files-first">Files First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        <div className="sort-option">
          <label>Sort direction:</label>
          <select id="sort-by-direction" className="sort-selector" onChange={(event) => setSortDirection(event.target.value)}>
            <option value="ascending">↑ (Ascending)</option>
            <option value="descending">↓ (Descending)</option>
          </select>
        </div>
      </div>
      <FileExplorer contents={contents} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} />
    </div>
  );
};
const SidebarTableOfContents = ({ path, onBack, importDirectory, onOpen, highlightSelectedRow }) => {
  // Based on the code from "Building a hierarchical tree from a flat list: an easy-to-understand solution & visualisation" by Selina Li (https://medium.com/@lizhuohang.selina/building-a-hierarchical-tree-from-a-flat-list-an-easy-to-understand-solution-visualisation-19cb24bdfa33).
  const unflatten = (records) => {
    const tree = [];
    const mappedArr = {};
    records.forEach((record) => {
      const id = record.id;
      if (!Object.prototype.hasOwnProperty.call(mappedArr, id)) {
        mappedArr[id] = record;
        mappedArr[id].children = [];
      }
    });
    for (const id in mappedArr) {
      if (Object.prototype.hasOwnProperty.call(mappedArr, id)) {
        const mappedElem = mappedArr[id];
        if (mappedElem.parentId) {
          const parentId = mappedElem.parentId;
          mappedArr[parentId].children.push(mappedElem);
        } else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  };
  const importTableOfContentsFile = () => {
    dialog
      .showOpenDialog({
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
        properties: ['openFile']
      })
      .then((fileChosen) => {
        if (fileChosen.filePaths[0] !== undefined) {
          setTableOfContentsPath(fileChosen.filePaths[0]);
          dialog
            .showMessageBox({
              title: 'Confirm',
              type: 'question',
              message: 'Do you want to load a folder for the table of contents to use?',
              buttons: ['Yes', 'No']
            })
            .then((result) => {
              if (result.response === 0) {
                importDirectory();
              }
            });
        }
      });
  };
  // Create a table of contents object from the records in the currently open table of contents text file.
  const [tableOfContentsPath, setTableOfContentsPath] = useState('');
  let i = 1; // Note: i must start at 1 and not 0, otherwise the tree will not be built properly.
  const recentParentStack = [];
  const initialTableOfContentsArray = useMemo(() => {
    if (tableOfContentsPath === '') {
      return [];
    } else {
      return fs
        .readFileSync(tableOfContentsPath, { encoding: 'utf8' })
        .toString()
        .split('\r\n')
        .filter((line) => {
          if (line.trim() == '') {
            return false;
          }
          return true;
        })
        .map((line) => {
          const lineArray = line.split('|').map((element) => {
            return element.trim();
          });
          const label = lineArray[0];
          const link = lineArray[1];
          const nestLevel = line.length - line.trimLeft().length;
          if (nestLevel == 0) {
            while (recentParentStack.length > 0) {
              recentParentStack.pop();
            }
            recentParentStack.push([label, nestLevel, i]);
            return {
              id: i++,
              label: label,
              link: link,
              parentId: ''
            };
          }
          const prev = recentParentStack[recentParentStack.length - 1][1];
          const curr = nestLevel;
          if (recentParentStack.length >= 0) {
            if (prev == curr) {
              recentParentStack.pop();
            }
            if (prev > curr) {
              for (let i = 0; i <= prev - curr; i++) {
                recentParentStack.pop();
              }
            }
            const parentId = recentParentStack[recentParentStack.length - 1][2];
            recentParentStack.push([label, nestLevel, i]);
            return {
              id: i++,
              label: label,
              link: link,
              parentId: parentId
            };
          }
        });
    }
  });
  const tableOfContentsObject = unflatten(initialTableOfContentsArray);
  return (
    <div id="sidebarTableOfContents" className="sidebar-content">
      <DirectorySelector path={path} onBack={onBack} importDirectory={importDirectory} />
      <br />
      <button id="select-file" onClick={importTableOfContentsFile}>
        Import Table of Contents file
      </button>
      <TableOfContents tableOfContentsObject={tableOfContentsObject} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} />
    </div>
  );
};

export default SidebarSection;
