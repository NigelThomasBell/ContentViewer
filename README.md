# ContentViewer
## Project description and features
* ContentViewer is a file viewer that allows the user to easily:
    * Navigate the local folders.
        * This is done by clicking on a folder (which will have a folder icon) in the file explorer.
        * To go back a folder, press the "Go Back" button.
        * To go to a specific directory, press the "Import Directory" button, and choose the folder to import. The folder can also be chosen from a different drive.
    * View files.
        * Files are rendered using the Chromium browser engine. This means that the same page layout and built-in viewers (for example the PDF viewer) from Chromium-based browsers such as Google Chrome and Opera are also available in ContentViewer.
    * Adjust the width of the file explorer and the page.
        * This is done by clicking on the section divider and dragging it left or right.
        * This is also good for demonstrating responsive web design in webpages.
    * Switch between files inside the currently selected folder.
        * This is done by clicking on one of the files (which will have a file icon) in the file explorer and then pressing the up arrow to go to the file above or the down arrow to go to the file below. The row of the currently selected file will have an orange background colour.
        * If your most recent click is within the file explorer and a file is selected, the file switching with the arrow keys can be done.
        * If your most recent click is within the page section, pressing the arrow keys will scroll through the file.
    * Search and sort the files and folders inside the currently selected folder.
        * Searching is done by typing in the search bar. The search will return the files and folders that includes the search term as a substring at any point of the file/folder name. 
            * For example, if a folder contains a `each.txt` file and a `teacher` folder, a search term of `ea` would return both.
        * The sorting options allow the files and folders to be sorted by contents (folders first, files first or alphabetically) and direction (ascending or descending).
    * Import and use a table of contents.
        * A table of contents file follows these rules: 
            * It is a `.txt` file with indenting (spaces, tabs or both) for the hierarchial order. 
            * A record in the table of contents has the following structure:
                ```
                name | relative link (optional)
                ```
            * For example:
                ```
                Annual Reports
                    2020 | 2020AnnualReport.pdf
                    2021 | 2021AnnualReport.pdf
                ```
            * Lines that are blank or contain only whitespace are ignored.
        * After importing the table of contents file, a prompt will appear asking the user if they want to open a folder that corresponds to the table of contents.
        * Records with links will be underlined. They can be accessed by clicking on them, or can be switched between (like files) with the up and down arrow keys.
* This project serves several purposes, which includes:
    * Learning about React development, with a focus towards creating a desktop application.
    * Experimenting with several popular frameworks, project scaffolds and other packages.
    * Learning how to convert a project using a legacy framework (create-react-app) to a newer framework (one that uses Vite).

## Note regarding the preference of yarn over npm
* Note that commands used for ContentViewer in yarn have been provided in the "Requirements and installation" section.
* After installing Node, enter this command in order to install yarn: 
    ```
    npm install --global yarn
    ```
* It is recommended to use yarn if possible, because it is faster (since it installs the packages in parallel instead of sequentially) and more secure (since it verifies the packages with a checksum instead of using SHA-512 from `package-lock.json`).

## Requirements and installation
* ContentViewer was made using Node, React, Electron, Vite, Bootstrap and FontAwesome.
* Several node modules are required for ContentViewer. These include:
    * Several modules already provided after running:
        ```
        yarn install
        ```
    * Electron remote:
        ```
        yarn add @electron/remote
        ```
    * Bootstrap (install the latest stable version):
        ```
        yarn add bootstrap@next
        ```
    * Font Awesome
        ```
        yarn add @fortawesome/fontawesome-svg-core
        yarn add @fortawesome/free-regular-svg-icons
        yarn add @fortawesome/free-solid-svg-icons
        yarn add @fortawesome/react-fontawesome
        ```

## Commands for ContentViewer after completing the requirements and installation:
* Run the ContentViewer in Electron:
    ```
    yarn dev
    ```
* Compile the ContentViewer into a build and an installer
    * For Windows
        ```
        yarn build:win
        ```
    * For macOS
        ```
        yarn build:mac
        ```
    * For Linux
        ```
        yarn build:linux
        ```
    
## Note regarding the Electron Security Warning (Insecure Content-Security-Policy).
* A Content-Security-Policy (CSP) has not been added within the head of `public/index.html` because ContentViewer uses inline scripting.

## Project History
### evo2 - 30/04/23
* Updated all packages.
* Replaced the project scaffolder with electron-vite.
* Created further functionality.
    * Added a table of contents option.
    * Added a VSCode inspired sidebar to select options.
* Significant code restructuring.
* Replaced the icons with ones from the FontAwesome library.
* Implemented code linting via ESLint with Prettier.
* Sizes (pre Table Of Contents): 
    * Installer size: 66.1 MB.
    * Installed project size : 228 MB.
* Sizes (post Table Of Contents): 
    * Installer size: 68.8 MB.
    * Installed project size : 245 MB.

### evo1 - 30/12/22
* Used create-react-app as the baseline React project scaffolder.
* Created the core functionality of the project:
    * Added the file explorer.
    * Adding the arrow key switching for files in the file explorer.
* Sizes: 
    * Installer size: 152 MB.
    * Installed project size: 561 MB.

## References
* ContentViewer was scaffolded with the [create-electron](https://github.com/alex8088/electron-vite) quick-start package. The command to do this is:
    ```
    npm create @quick-start/electron
    ```
* The file explorer is based on the "Electron with React - Building a desktop applications with React and Electron" tutorial by Coding with Justin, which consists of a [YouTube video](https://www.youtube.com/watch?v=oAaS9ix8pes) and a [GitHub repository](https://github.com/codingwithjustin/react-electron). I created and used an [updated version of the repository](https://github.com/NigelBell/react-electron). Both the tutorial and the updated repository were scaffolded with [Create React App](https://github.com/facebook/create-react-app).
* The section divider is based on the "Resizable Sidebar" code snippet by Xingchen Hong (https://codepen.io/Zodiase/pen/qmjyKL).
* The code to unflatten the table of contents array is based on the code from "Building a hierarchical tree from a flat list: an easy-to-understand solution & visualisation" by Selina Li (https://medium.com/@lizhuohang.selina/building-a-hierarchical-tree-from-a-flat-list-an-easy-to-understand-solution-visualisation-19cb24bdfa33).