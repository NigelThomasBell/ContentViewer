import welcomePage from './../pages/welcome.html?url';

function PageSection(): JSX.Element {
  return (
    <main id="page-section">
      <iframe id="page-iframe" title="page-iframe" src={welcomePage}></iframe>
    </main>
  );
}

export default PageSection;
