import ActivityBarSection from './components/ActivityBarSection';
import SidebarSection from './components/SidebarSection';
import SectionDivider from './components/SectionDivider';
import PageSection from './components/PageSection';

function App(): JSX.Element {
  return (
    <div id="container" className="App">
      <ActivityBarSection />
      <SidebarSection />
      <SectionDivider />
      <PageSection />
    </div>
  );
}

export default App;
