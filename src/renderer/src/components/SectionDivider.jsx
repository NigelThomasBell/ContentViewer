import { useEffect } from 'react';

const SectionDivider = () => {
  // Side effect code for interacting with the section divider. Based on the "Resizable Sidebar" code snippet by Xingchen Hong (https://codepen.io/Zodiase/pen/qmjyKL). All jQuery code has been converted into plain JavaScript code.
  useEffect(() => {
    const sidebarSection = document.getElementById('sidebar-section');
    const sectionDivider = document.getElementById('section-divider');
    const pageIFrame = document.getElementById('page-iframe');
    const resizeData = {
      tracking: false,
      startWidth: null,
      startCursorScreenX: null,
      handleWidth: 10,
      resizeTarget: null,
      parentElement: null,
      maxWidth: null
    };
    sectionDivider.addEventListener('mousedown', (event) => {
      if (event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const handleElement = event.currentTarget;
      if (!handleElement.parentElement) {
        console.error(new Error('Parent element not found.'));
        return;
      }
      const targetSelector = handleElement.getAttribute('data-target');
      const targetElement = !(handleElement.parentElement instanceof HTMLElement) ? null : handleElement.parentElement.querySelector(targetSelector);
      if (!targetElement) {
        console.error(new Error('Resize target element not found.'));
        return;
      }
      resizeData.startWidth = targetElement.offsetWidth;
      resizeData.startCursorScreenX = event.screenX;
      resizeData.resizeTarget = targetElement;
      resizeData.parentElement = handleElement.parentElement;
      resizeData.maxWidth = handleElement.parentElement.clientWidth - resizeData.handleWidth;
      resizeData.tracking = true;
      sidebarSection.style.pointerEvents = 'none';
      pageIFrame.style.pointerEvents = 'none';
    });
    window.addEventListener('mousemove', (event) => {
      if (resizeData.tracking) {
        const cursorScreenXDelta = event.screenX - resizeData.startCursorScreenX;
        const newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
        sidebarSection.style.width = newWidth + 'px';
      }
    });
    window.addEventListener('mouseup', () => {
      if (resizeData.tracking) {
        resizeData.tracking = false;
        sidebarSection.style.pointerEvents = 'all';
        pageIFrame.style.pointerEvents = 'all';
      }
    });
  });
  return <div id="section-divider" data-target="aside" />;
};

export default SectionDivider;
