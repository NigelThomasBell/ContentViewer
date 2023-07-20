type MappedElement = {
  id: number;
  label: string;
  link: string | undefined;
  parentId: number | null;
  children: MappedElement[];
};
type TableOfContentsProps = {
  tableOfContentsObject: MappedElement[];
  onOpen: (content: string | null | undefined, isDirectory: boolean) => void;
  highlightSelectedRow: (rowLabel: string | null) => void;
};
type TableOfContentsRecordProps = {
  record: MappedElement;
  onOpen: (content: string | null | undefined, isDirectory: boolean) => void;
  highlightSelectedRow: (rowLabel: string | null) => void;
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ tableOfContentsObject, onOpen, highlightSelectedRow }) => {
  return (
    <ol id="list-area">
      {tableOfContentsObject.map((index) => (
        <TableOfContentsRecord record={index} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} key={index.id} />
      ))}
    </ol>
  );
};
const TableOfContentsRecord: React.FC<TableOfContentsRecordProps> = ({ record, onOpen, highlightSelectedRow }) => {
  // If the record has children, recursively map the children and its children and so on until there are no more children.
  let children: JSX.Element | null = null;
  if (record.children.length > 0) {
    children = (
      <ol>
        {record.children.map((index) => (
          <TableOfContentsRecord record={index} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} key={index.id} />
        ))}
      </ol>
    );
  }
  // If the record has a link, allow the record label to be clickable. When clicked, it will open the corresponding content and display it in the page section IFrame and also highlight the selected row. Any children of the record are also displayed. If the record does not have a link, only display the label and children.
  if (record.link != undefined) {
    return (
      <li
        id={'tableOfContents' + record.id}
        className={'clickable clickable-record'}
        onClick={(): void => {
          onOpen(record.link, false);
          highlightSelectedRow('tableOfContents' + record.id);
        }}
        data-record-link={record.link}
      >
        {record.label}
        {children}
      </li>
    );
  } else {
    return (
      <li id={'tableOfContents' + record.id}>
        {record.label}
        {children}
      </li>
    );
  }
};

export default TableOfContents;
