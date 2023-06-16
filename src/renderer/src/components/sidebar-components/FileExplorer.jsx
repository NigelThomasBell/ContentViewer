import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder as faRegularFolder, faFile as faRegularFile } from '@fortawesome/free-regular-svg-icons';

const FileExplorer = ({ contents, onOpen, highlightSelectedRow }) => {
  return (
    <table className="table">
      <tbody className="table-body">
        {contents.map(({ id, name, isDirectory, size }) => {
          const classes = 'clickable ' + (isDirectory ? 'folder' : 'file');
          return (
            <tr
              key={id}
              id={'content' + id}
              className={classes}
              onClick={() => {
                onOpen(name, isDirectory);
                if (!isDirectory) {
                  highlightSelectedRow('content' + id);
                }
              }}
            >
              <td className="icon-row">{isDirectory ? <FontAwesomeIcon icon={faRegularFolder} /> : <FontAwesomeIcon icon={faRegularFile} />}</td>
              <td>{name}</td>
              <td>
                <span className="float-end">{size}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default FileExplorer;
