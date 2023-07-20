type DirectorySelectorProps = {
  path: string;
  onBack: () => void;
  importDirectory: () => void;
};

const DirectorySelector: React.FC<DirectorySelectorProps> = ({ path, onBack, importDirectory }) => {
  return (
    <div>
      <h4 id="current-directory-heading">{path}</h4>
      <div id="button-section">
        <button onClick={onBack}>Go Back</button>
        <button onClick={importDirectory}>Import Directory</button>
      </div>
    </div>
  );
};

export default DirectorySelector;
