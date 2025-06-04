[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jTsmcDjg)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19462486&assignment_repo_type=AssignmentRepo)
## Creative Coding + AI II: Custom Pixel

### MDDN 242 Project 3: Data Mapping
### Jazzelle Richdale
# Clouds to Outer Space

### Design Intentions
To start this project, I took about 100 photos at a farm, mostly of trees, clouds and sheep. I knew I wanted to highlight the clouds in some sort of way. Initially I wanted to see if the AI could tell the  difference between clouds and sheep, but it wouldn’t have worked, as the photos were lit completely differently, with different backgrounds.   
I then started thinking of how I could transform the clouds, and made a connection between cloud shapes and galaxy shapes. I’ve always been really interested in outer space, galaxies, astrophysics and what could be out there, so I thought this would be a great opportunity to explore what aspects make up outer space. 

### Inspiration
I looked at many photos of space/galaxies for inspiration, but ended up mostly referencing this photo of galaxy ALESS 073.1.  
![Galaxy Reference Image](https://github.com/25-MDDN242/25-data-mapping-jazzellelara/blob/main/galaxy.jpg "galaxy image reference")  
  
Additionally, I referenced this image of a star being digitally highlighted to create a small signal tracker UI.  
![Signal Reference Image](https://github.com/25-MDDN242/25-data-mapping-jazzellelara/blob/main/signal.jpg "signal image reference")  


### Design Process

#### *Masking and AI Camera*
I used Adobe Photoshop to mask my images, and made quite detailed masks. I then ran them through the AI camera, and the generated masks, while accurate to the input image’s clouds, were much less detailed. I decided to work around the lack of mask detail by using code image filters. 

#### *Initial Tests*
Initially I played around with the preexisting pointillism code, and worked out the overall code structure. I then looked through all the example filters, and pondered how I could change the clouds to look like a galaxy. I knew I wanted a sort of signal locator, and decided to play around with blob tracking. Even though the masks were scattered and vague, the blob tracker did a really good job of locating the densest part of the cloud. 

#### *Colour Change, Warp and Blur*
I separately adjusted the colours, making the masked area a dark space blue and the clouds and pinky light blue. I warped the edges to help the AI masks match the details of the human-made masks. I then struggled with the blur function. It was working perfectly fine in my code, but the image with blur could not be processed, as it took too long. I was going to rely on blur to make the “galaxy” and stars (that are added later) look more diffused, but I had to find a different solution. For the galaxy I adjusted the colours to blend more with the background, and changed the warp to diffuse the edges. 

#### *Layered Stars*
There are four layers of stars in the image. To achieve this is used a layer system in an if-else loop, where the next layer is added on top of the previous. The first layer fills the image with small ellipses, white blue in unmasked areas and medium blue in masked areas to create some depth. The second layer adds more ellipses all over the images, using the colour data from the raw image.   
The third layer adds more prominent stars. Within the galaxy, the star color is randomised between blue, purple and pink hues, and in the masked area the colours are just randomised blue hues. These stars have a diffused look that was created without blur. This was done by calling layers of half transparent radial gradients from a function. The fourth layer adds 10 large stars, in the same style as the third layer. I added the larger stars to align as I noticed that in my reference images there were always a few really large and bright stars present. 

#### *Blob Tracking Signal Locator*
I finally adjusted the look of my blob tracking “signal locator”. I added a small red star in the center, again using the gradient function, a square around it, and words saying “unknown signal detected”.

#### *Conclusion*
I really like space, so I really enjoyed this project. It was fun to analyse and unpack what made a photo of outer space identifiable as such. It was also interesting looking into what causes unusual signals from deep space. This project gave me a lot more experience with for loops and if-else functions, as well as further experience with AI image generation.   
Lots of people have photos of clouds in the sky, so this filter could be used by them to make cool space art! The colours can be tweaked to create any colour of galaxy a person could desire. If I choose to work on this project in future, I would like to add galaxy colour randomisation, to create more unique outputs. 

---
#### *Image Sources*
Primordial Galaxy. (2021, February 15). Innovation News Network. https://www.innovationnewsnetwork.com/primordial-galaxy/9398/

Ralls, E. (2025, February 6). Strange object firing unknown signals at Earth. earth.com. https://www.earth.com/news/askap-j1832-0911-unknown-object-is-firing-strange-x-rays-radio-signals-at-earth-every-44-minutes-exactly/