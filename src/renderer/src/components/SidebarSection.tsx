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

type ShowOpenDialogPromiseObject = {
  canceled: boolean;
  filePaths: string[];
  bookmarks: string[];
};
type ShowMessageBoxPromiseObject = {
  response: number;
  checkboxChecked: boolean;
};
type SidebarActivityProps = {
  path: string;
  onBack: () => void;
  importDirectory: () => void;
  onOpen: (content: string | null | undefined, isDirectory: boolean) => void;
  highlightSelectedRow: (rowLabel: string | null) => void;
};
type ContentObject = {
  id: number;
  name: string;
  size: string | null;
  isDirectory: boolean;
};
type MappedElement = {
  id: number;
  label: string;
  link: string | undefined;
  parentId: number | null;
  children: MappedElement[];
};
type RecentParentStackItem = {
  index: number;
  label: string;
  nestLevel: number;
};

function SidebarSection(): JSX.Element {
  // Create a state variable called 'path'.
  const [path, setPath] = useState<string>(app.getAppPath());
  // Go back one directory. Otherwise redirect to the closest parent directory.
  const onBack = (): void => {
    if (fs.existsSync(path)) {
      setPath(pathModule.dirname(path));
      highlightSelectedRow(null);
    } else {
      const pageIFrame = document.getElementById('page-iframe') as HTMLIFrameElement;
      let newPath = pathModule.dirname(path);
      while (!fs.existsSync(newPath)) {
        newPath = pathModule.dirname(newPath);
      }
      setPath(newPath);
      highlightSelectedRow(null);
      pageIFrame.src = redirectedToClosestParentPage;
    }
  };
  // Import a directory to the file explorer or the table of contents.
  const importDirectory = (): void => {
    const currentDirectoryHeading = document.getElementById('current-directory-heading') as HTMLHeadingElement;
    dialog
      .showOpenDialog({
        title: 'Import Directory',
        properties: ['openDirectory']
      })
      .then((directoryChosen: ShowOpenDialogPromiseObject) => {
        if (directoryChosen.filePaths[0] != undefined) {
          currentDirectoryHeading.textContent = directoryChosen.filePaths[0];
          setPath(directoryChosen.filePaths[0]);
          highlightSelectedRow(null);
        }
      });
  };
  // Handle opening and displaying files and folders from the file explorer or the table of contents.
  const onOpen = (content: string | null | undefined, isDirectory: boolean): void => {
    if (content != null) {
      const currentDirectoryHeading = document.getElementById('current-directory-heading') as HTMLHeadingElement;
      const pageIFrame = document.getElementById('page-iframe') as HTMLIFrameElement;
      const contentPath = pathModule.join(currentDirectoryHeading.textContent, content);
      if (isDirectory) {
        if (fs.existsSync(contentPath)) {
          setPath(contentPath);
          highlightSelectedRow(null);
        } else {
          pageIFrame.src = errorFolderNotFoundPage;
        }
      } else {
        if (fs.existsSync(contentPath)) {
          pageIFrame.src = contentPath;
        } else {
          pageIFrame.src = errorFileNotFoundPage;
        }
      }
    }
  };
  // Highlight the currently selected row in the file explorer or the table of contents. Otherwise, remove any previous highlighting.
  const highlightSelectedRow = (rowLabel: string | null): void => {
    if (rowLabel != null) {
      const selectedRow = document.getElementById(rowLabel) as HTMLTableRowElement;
      const elements = document.querySelectorAll('tr.selected, li.clickable.selected');
      elements.forEach((element) => {
        element.classList.remove('selected');
      });
      selectedRow.classList.add('selected');
    } else {
      const selectedRow = document.getElementsByClassName('selected');
      if (selectedRow.length > 0) {
        selectedRow[0].classList.remove('selected');
      }
    }
  };
  // Side effect code for moving between the files in the currently open folder, or the records in the currently open table of contents. Movement is done with the up and down arrow keys.
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
        const fileNames: string[] = [];
        for (let index = 0; index < filesCollection.length; index++) {
          const filesCollectionCellTextContent: string | null = filesCollection[index].getElementsByTagName('td')[1].textContent;
          if (filesCollectionCellTextContent != null) {
            fileNames.push(filesCollectionCellTextContent);
          }
        }
        if (currentSelectedRow.length != 0 && filesCollection.length > 0) {
          const currentSelectedRowCellTextContent = currentSelectedRow[0].getElementsByTagName('td')[1].textContent as string;
          let index: number = fileNames.indexOf(currentSelectedRowCellTextContent);
          switch (event.key) {
            case 'ArrowUp':
              if (index == 0) {
                index = filesCollection.length - 1;
              } else {
                index -= 1;
              }
              onOpen(filesCollection[index].getElementsByTagName('td')[1].textContent, false);
              highlightSelectedRow(filesCollection[index].id);
              break;
            case 'ArrowDown':
              if (index == filesCollection.length - 1) {
                index = 0;
              } else {
                index += 1;
              }
              onOpen(filesCollection[index].getElementsByTagName('td')[1].textContent, false);
              highlightSelectedRow(filesCollection[index].id);
              break;
            default:
              break;
          }
        }
      }
      // If the table of contents is enabled.
      if (sidebarContent[1].classList.contains('active')) {
        const recordsCollection = document.getElementsByClassName('clickable-record') as HTMLCollection;
        const recordNames: string[] = [];
        for (let index = 0; index < recordsCollection.length; index++) {
          recordNames.push(recordsCollection[index].innerHTML);
        }
        if (currentSelectedRow.length != 0 && recordsCollection.length > 0) {
          let index = recordNames.indexOf(currentSelectedRow[0].innerHTML);
          switch (event.key) {
            case 'ArrowUp':
              if (index == 0) {
                index = recordsCollection.length - 1;
              } else {
                index -= 1;
              }
              onOpen(recordsCollection[index].getAttribute('data-record-link'), false);
              highlightSelectedRow(recordsCollection[index].id);
              break;
            case 'ArrowDown':
              if (index == recordsCollection.length - 1) {
                index = 0;
              } else {
                index += 1;
              }
              onOpen(recordsCollection[index].getAttribute('data-record-link'), false);
              highlightSelectedRow(recordsCollection[index].id);
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
}
const SidebarFileExplorer: React.FC<SidebarActivityProps> = ({ path, onBack, importDirectory, onOpen, highlightSelectedRow }) => {
  // Format the file size as a string.
  const formatFileSize = (size: number): string => {
    const index = Math.floor(Math.log(size) / Math.log(1024));
    return Number((size / Math.pow(1024, index)).toFixed(2)) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB'][index];
  };
  // Organize the content in a folders array and a files array.
  const collectContentArrays = (foldersArray: string[], filesArray: string[]): void => {
    for (let index = 0; index < contents.length; index++) {
      switch (contents[index].isDirectory) {
        case true:
          foldersArray.push(contents[index]);
          break;
        case false:
          filesArray.push(contents[index]);
          break;
        default:
          break;
      }
    }
  };
  // Collect an initial list of contents from the currently open directory. First, filter out any contents where information about them cannot be accessed. Then, sort each piece of content by name in a natural sort order. Finally, for each piece of content, gather information about them and store them in a object.
  let index = 0;
  const initialContents = useMemo(
    () =>
      fs
        .readdirSync(path)
        .filter((contentName: string) => {
          try {
            fs.statSync(pathModule.join(path, contentName));
            return true;
          } catch (error) {
            return false;
          }
        })
        .sort((contentName1: string, contentName2: string) =>
          contentName1.localeCompare(contentName2, navigator.languages[0] || navigator.language, {
            numeric: true,
            ignorePunctuation: false
          })
        )
        .map((contentName: string) => {
          const stats = fs.statSync(pathModule.join(path, contentName));
          return {
            id: index++,
            name: contentName,
            size: stats.isFile() ? (stats.size != 0 ? formatFileSize(stats.size) : '0 B') : null,
            isDirectory: stats.isDirectory()
          };
        }),
    [path, index]
  );
  // Get a refined list of contents based on the search input and sorting options chosen.
  const [searchString, setSearchString] = useState<string>('');
  let contents = initialContents.filter((content: ContentObject) => content.name.includes(searchString));
  const [sortType, setSortType] = useState<string>('folders-first');
  const [sortDirection, setSortDirection] = useState<string>('ascending');
  if (sortType != null) {
    switch (sortType) {
      case 'folders-first':
        contents = [...contents].sort((a, b) => Number(b['isDirectory']) - Number(a['isDirectory']));
        break;
      case 'files-first':
        contents = [...contents].sort((a, b) => Number(!b['isDirectory']) - Number(!a['isDirectory']));
        break;
      case 'alphabetical':
        contents = [...contents].sort((a, b) => Number(a['id']) - Number(b['id']));
        break;
      default:
        break;
    }
  }
  const foldersArray = [];
  const filesArray = [];
  collectContentArrays(foldersArray, filesArray);
  if (sortDirection != null) {
    switch (sortDirection) {
      case 'ascending':
        contents = contents.sort();
        break;
      case 'descending':
        switch (sortType) {
          case 'folders-first':
            contents = foldersArray.reverse().concat(filesArray.reverse());
            break;
          case 'files-first':
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
        <input className="form-control form-control-sm" onChange={(event): void => setSearchString(event.target.value)} value={searchString} placeholder="Search..." />
        <div className="sort-option">
          <label>Sort type:</label>
          <select id="sort-by-type" className="sort-selector" onChange={(event): void => setSortType(event.target.value)}>
            <option value="folders-first">Folders First</option>
            <option value="files-first">Files First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        <div className="sort-option">
          <label>Sort direction:</label>
          <select id="sort-by-direction" className="sort-selector" onChange={(event): void => setSortDirection(event.target.value)}>
            <option value="ascending">↑ (Ascending)</option>
            <option value="descending">↓ (Descending)</option>
          </select>
        </div>
      </div>
      <FileExplorer contents={contents} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} />
    </div>
  );
};
const SidebarTableOfContents: React.FC<SidebarActivityProps> = ({ path, onBack, importDirectory, onOpen, highlightSelectedRow }) => {
  // Builds a hierarchical tree from the initial table of contents array. Based on the code from "Building a hierarchical tree from a flat list: an easy-to-understand solution & visualisation" by Selina Lindex (https://medium.com/@lizhuohang.selina/building-a-hierarchical-tree-from-a-flat-list-an-easy-to-understand-solution-visualisation-19cb24bdfa33).
  const unflatten = (records: MappedElement[]): MappedElement[] => {
    const tree: MappedElement[] = [];
    const mappedObject = {};
    records.forEach((record) => {
      const id = record.id;
      if (!Object.prototype.hasOwnProperty.call(mappedObject, id)) {
        mappedObject[id] = record;
        mappedObject[id].children = [];
      }
    });
    for (const id in mappedObject) {
      if (Object.prototype.hasOwnProperty.call(mappedObject, id)) {
        const mappedElement = mappedObject[id];
        if (mappedElement.parentId) {
          const parentId = mappedElement.parentId;
          mappedObject[parentId].children.push(mappedElement);
        } else {
          tree.push(mappedElement);
        }
      }
    }
    return tree;
  };
  // Import a table of contents text file to the table of contents. Then, ask if the user should import a directory for the table of contents to use. If 'Yes' is selected, import a directory to the table of contents.
  const importTableOfContentsFile = (): void => {
    dialog
      .showOpenDialog({
        title: 'Import Table of Contents File',
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
        properties: ['openFile']
      })
      .then((fileChosen: ShowOpenDialogPromiseObject) => {
        if (fileChosen.filePaths[0] != undefined) {
          setTableOfContentsPath(fileChosen.filePaths[0]);
          dialog
            .showMessageBox({
              title: 'Import a directory for the Table of Contents',
              type: 'question',
              message: 'Do you want to import a directory for the table of contents to use?',
              buttons: ['Yes', 'No']
            })
            .then((result: ShowMessageBoxPromiseObject) => {
              if (result.response == 0) {
                importDirectory();
              }
            });
        }
      });
  };
  // Create a table of contents object from the records in the currently open table of contents text file. First, format the record lines and filter out empty ones. Then, for each record line, split them into the label and the link, gather information about them and store them in a object. Child records are nested inside parent records, based on their parentId and nest level. Note that the index must start at 1 and not 0, otherwise the tree will not be built properly.
  const [tableOfContentsPath, setTableOfContentsPath] = useState<string | null>(null);
  let index = 1;
  /*
  const initialTableOfContentsArray = useMemo(() => {
    const recentParentStack: RecentParentStackItem[] = [];
    if (tableOfContentsPath == null) {
      return [];
    } else {
      return fs
        .readFileSync(tableOfContentsPath, { encoding: 'utf8' })
        .toString()
        .split('\r\n')
        .filter((line: string) => {
          if (line.trim() == '') {
            return false;
          }
          return true;
        })
        .map((line: string) => {
          const lineArray = line.split('|').map((element) => {
            return element.trim();
          });
          const label = lineArray[0];
          const link = lineArray[1];
          const nestLevel = line.length - line.trimStart().length;
          if (nestLevel == 0) {
            while (recentParentStack.length > 0) {
              recentParentStack.pop();
            }
            recentParentStack.push({ index, label, nestLevel });
            return {
              id: index++,
              label: label,
              link: link,
              parentId: null
            };
          }
          const previous = recentParentStack[recentParentStack.length - 1].nestLevel;
          const current = nestLevel;
          if (recentParentStack.length >= 0) {
            if (previous == current) {
              recentParentStack.pop();
            }
            if (previous > current) {
              for (let index = 0; index <= previous - current; index++) {
                recentParentStack.pop();
              }
            }
            const parentId = recentParentStack[recentParentStack.length - 1].index;
            recentParentStack.push({ index, label, nestLevel });
            return {
              id: index++,
              label: label,
              link: link,
              parentId: parentId
            };
          }
          return {};
        });
    }
  }, [tableOfContentsPath]);
  */
  const initialTableOfContentsArray = useMemo(() => {
    const recentParentStack: RecentParentStackItem[] = [];
    if (tableOfContentsPath == null) {
      return [];
    } else {
      return fs
        .readFileSync(tableOfContentsPath, { encoding: 'utf8' })
        .toString()
        .split('\r\n')
        .filter((line: string) => {
          if (line.trim() == '') {
            return false;
          }
          return true;
        })
        .map((line: string) => {
          const lineArray = line.split('|').map((element) => {
            return element.trim();
          });
          const label = lineArray[0];
          const link = lineArray[1];
          const nestLevel = line.length - line.trimStart().length;
          if (nestLevel == 0) {
            while (recentParentStack.length > 0) {
              recentParentStack.pop();
            }
            recentParentStack.push({ index, label, nestLevel });
            return {
              id: index++,
              label: label,
              link: link,
              parentId: null
            };
          }
          const previous = recentParentStack[recentParentStack.length - 1].nestLevel;
          const current = nestLevel;
          if (recentParentStack.length >= 0) {
            if (previous == current) {
              recentParentStack.pop();
            }
            if (previous > current) {
              for (let index = 0; index <= previous - current; index++) {
                recentParentStack.pop();
              }
            }
            const parentId = recentParentStack[recentParentStack.length - 1].index;
            recentParentStack.push({ index, label, nestLevel });
            return {
              id: index++,
              label: label,
              link: link,
              parentId: parentId
            };
          }
          return {};
        });
    }
  }, [tableOfContentsPath]);

  return (
    <div id="sidebarTableOfContents" className="sidebar-content">
      <DirectorySelector path={path} onBack={onBack} importDirectory={importDirectory} />
      <br />
      <button id="select-file" onClick={importTableOfContentsFile}>
        Import Table of Contents file
      </button>
      <TableOfContents tableOfContentsObject={unflatten(initialTableOfContentsArray)} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} />
    </div>
  );
};

export default SidebarSection;
