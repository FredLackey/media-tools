# media-tools
Tools for working with multimedia files (mp3, mp4, m4a, editing tags, etc.).

## About  
Currently under development.  Helps provide mass-updating and housekeeping tasks while downloading music from services like Spotify and YouTube.

## Formats Supported  
Theoretically, the utility can support any format supported by FFMpeg.  However, during this initial development phase, support is limited to the following formats:

* ASF  
* AVI  
* FLV  
* MP3  
* MP4  
* M4A  
* WMA  
* WMV  

## Assumptions  
At the moment, the utility requires files to be named in a specific format:

    <title> - <artist>.<extension>
    <title> - <edition> - <artist>.<extension>

For example, one of these will work:  

    Colour Me - Juke Ross.m4a
    Colour Me - Autograf Remix - Juke Ross.m4a

## Requirements  
Node JS and FFMpeg must be installed on the system.

## Limitations  
Tag information cannot be cleared from a file unless the file name has replacement data available.  This is a safety procaution.  A `force` switch will be added in the future.

## Usage  
At the moment, there are only two commands in the utility:

    tag-clear <path>
    tag-set-from-file <path>  

Both of these will cause search the path and either clear the meta data or set the meta data.  Once installed, these commands are available system-wide.

## Installation  
Install the utility, and the above commands, as follows:

    npm install media-tools

## Contact Information  
Please feel free to contact me directly with any questions or suggestions:  

Fred Lackey  
[www.fredlackey.com](http://www.fredlackey.com)  
[fred.lackey@gmail.com](mailto:fred.lackey@gmail.com)  



