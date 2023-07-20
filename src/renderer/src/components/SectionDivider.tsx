import { useEffect } from 'react';

type SectionDividerDataObject = {
  tracking: boolean;
  startWidth: number;
  startCursorScreenX: number | null;
  handleWidth: number;
  resizeTarget: HTMLElement | null;
  parentElement: HTMLElement | null;
  maxWidth: number;
};

function SectionDivider(): JSX.Element {
  // Side effect code for interacting with the section divider. Based on the "Resizable Sidebar" code snippet by Xingchen Hong (https://codepen.io/Zodiase/pen/qmjyKL). All jQuery code has been converted into TypeScript code.
  useEffect(() => {
    const sidebarSection = document.getElementById('sidebar-section') as HTMLElement;
    const sectionDivider = document.getElementById('section-divider') as HTMLDivElement;
    const pageIFrame = document.getElementById('page-iframe') as HTMLIFrameElement;
    const sectionDividerData: SectionDividerDataObject = {
      tracking: false,
      startWidth: 0,
      startCursorScreenX: null,
      handleWidth: 10,
      resizeTarget: null,
      parentElement: null,
      maxWidth: 0
    };
    // When the left mouse button is pressed, allow the section divider to move.
    sectionDivider.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const handleElement = event.currentTarget as HTMLElement;
      if (handleElement != null) {
        const targetSelector = handleElement.getAttribute('data-target');
        if (targetSelector != null) {
          if (handleElement.parentElement instanceof HTMLElement) {
            const targetElement = handleElement.parentElement.querySelector(targetSelector) as HTMLElement;
            if (targetElement != null && handleElement.parentElement != null) {
              sectionDividerData.startWidth = targetElement.offsetWidth;
              sectionDividerData.startCursorScreenX = event.screenX;
              sectionDividerData.resizeTarget = targetElement;
              sectionDividerData.parentElement = handleElement.parentElement;
              sectionDividerData.maxWidth = handleElement.parentElement.clientWidth - sectionDividerData.handleWidth;
              sectionDividerData.tracking = true;
              sidebarSection.style.pointerEvents = 'none';
              pageIFrame.style.pointerEvents = 'none';
            }
          }
        }
      }
    });
    // When the left mouse button is released, stop the section divider from moving.
    window.addEventListener('mouseup', () => {
      if (sectionDividerData.tracking) {
        sectionDividerData.tracking = false;
        sidebarSection.style.pointerEvents = 'all';
        pageIFrame.style.pointerEvents = 'all';
      }
    });
    // While the left mouse button is pressed and the mouse is dragged horizontally, move the section divider.
    window.addEventListener('mousemove', (event) => {
      if (sectionDividerData.tracking) {
        if (sectionDividerData.startCursorScreenX != null) {
          const cursorScreenXDelta = event.screenX - sectionDividerData.startCursorScreenX;
          const newWidth = Math.min(sectionDividerData.startWidth + cursorScreenXDelta, sectionDividerData.maxWidth);
          sidebarSection.style.width = newWidth + 'px';
        }
      }
    });
  });
  return <div id="section-divider" data-target="aside" />;
}

export default SectionDivider;
