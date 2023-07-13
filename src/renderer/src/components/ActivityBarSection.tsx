import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderTree as faSolidFolderTree, faList as faSolidList } from '@fortawesome/free-solid-svg-icons';

function ActivityBarSection(): JSX.Element {
  // Display the selected activity as active in the activity bar with the corresponding content in the sidebar.
  const openActivity = (activityName: string): void => {
    const activities = document.getElementsByClassName('activity') as HTMLCollection;
    const sidebarContent = document.getElementsByClassName('sidebar-content') as HTMLCollection;
    for (let index = 0; index < activities.length; index++) {
      activities[index].className = activities[index].className.replace(' active', '');
      sidebarContent[index].className = sidebarContent[index].className.replace(' active', '');
    }
    const selectedActivityElement = document.getElementById('activity' + activityName) as HTMLButtonElement;
    const selectedSidebarContentElement = document.getElementById('sidebar' + activityName) as HTMLDivElement;
    if (selectedActivityElement != null && selectedSidebarContentElement != null) {
      selectedActivityElement.classList.add('active');
      selectedSidebarContentElement.classList.add('active');
    }
  };
  return (
    <div id="activity-bar-section">
      <button
        id="activityFileExplorer"
        className="activity active"
        onClick={(): void => {
          openActivity('FileExplorer');
        }}
        title="File Explorer"
      >
        <FontAwesomeIcon icon={faSolidFolderTree} />
      </button>
      <button
        id="activityTableOfContents"
        className="activity"
        onClick={(): void => {
          openActivity('TableOfContents');
        }}
        title="Table of Contents"
      >
        <FontAwesomeIcon icon={faSolidList} />
      </button>
    </div>
  );
}

export default ActivityBarSection;
