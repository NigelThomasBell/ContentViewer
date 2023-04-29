const DirectorySelector = ({ path, onBack, importDirectory }) => {
  return (
    <div>
      <h4 id="current-folder-directory">{path}</h4>
      <div id="button-section">
        <button onClick={onBack}>Go Back</button>
        <button onClick={importDirectory}>Import Directory</button>
      </div>
    </div>
  );
};

export default DirectorySelector;
