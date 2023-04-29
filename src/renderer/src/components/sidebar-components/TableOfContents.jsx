const TableOfContents = ({ tableOfContentsObject, onOpen, highlightSelectedRow }) => {
  return (
    <ol id="list-area">
      {tableOfContentsObject.map((i) => (
        <ListRecord record={i} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} key={i.id} />
      ))}
    </ol>
  );
};
const ListRecord = ({ record, onOpen, highlightSelectedRow }) => {
  // If the record has children, recursively map the children and its children and so on until there is no more children.
  let children = null;
  if (record.children.length > 0) {
    children = (
      <ol>
        {record.children.map((i) => (
          <ListRecord record={i} onOpen={onOpen} highlightSelectedRow={highlightSelectedRow} key={i.id} />
        ))}
      </ol>
    );
  }
  // If the record has a link, allow the record label to be clickable. When clicked, it will open the corresponding content and display it in the page section iframe and also highlight the selected row. Any children of the record are also displayed. If the record does not have a link, only display the label and children.
  if (record.link != undefined) {
    return (
      <li
        id={'tableOfContents' + record.id}
        className={'clickable clickable-record'}
        onClick={() => {
          onOpen(record.link);
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
