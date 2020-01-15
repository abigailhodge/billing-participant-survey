# Eyebilling

The Eyebilling app was created for the University of Kaiserslautern Psycholinguistics Group, for use in their **Eye**tracking **Bi**lingual **Ling**uistics lab. Though it uses web technology, is takes advantage of the Electron framework to be deployable as a desktop application, which allows it to be used on computers without internet access, and on both MacOS and Windows operating system. This was necessary to meet the unique needs of this lab, which had several offline computers across a variety of operating systems. This is also why Bootstrap is included within the project as a minified CSS file, rather than being served through a CDN. 

To get started, once you clone this repository run
```
npm install 
```
to install necessary packages. To start the electron app on your local machine simply run 
```
npm start
```
