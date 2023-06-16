import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderTree as faSolidFolderTree, faList as faSolidList } from '@fortawesome/free-solid-svg-icons';

const ActivityBarSection = () => {
  const openActivity = (activityName) => {
    const activities = document.getElementsByClassName('activity');
    const sidebarContent = document.getElementsByClassName('sidebar-content');
    for (let i = 0; i < activities.length; i++) {
      activities[i].className = activities[i].className.replace(' active', '');
      sidebarContent[i].className = sidebarContent[i].className.replace(' active', '');
    }
    document.getElementById('activity' + activityName).classList += ' active';
    document.getElementById('sidebar' + activityName).classList += ' active';
  };
  return (
    <div id="activity-bar-section">
      <button
        id="activityFileExplorer"
        className="activity active"
        onClick={() => {
          openActivity('FileExplorer');
        }}
        title="File Explorer"
      >
        <FontAwesomeIcon icon={faSolidFolderTree} />
      </button>
      <button
        id="activityTableOfContents"
        className="activity"
        onClick={() => {
          openActivity('TableOfContents');
        }}
        title="Table Of Contents"
      >
        <FontAwesomeIcon icon={faSolidList} />
      </button>
    </div>
  );
};

export default ActivityBarSection;
