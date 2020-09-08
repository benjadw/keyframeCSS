# KeyframeCSS
Last stable release (v1)



#### Description:
Make animations binding keyframes with the page scroll position.



## Installation

####  Add script in <head>:
<script src="/js/keyframeCss.js"></script>

## How to use it?
#### Generate configuration object (example):

```
var keyframes = new Keyframes({
        size: 18000, // Optional: Set min-height to de body element
        timeType: 'pixels', // Optional: Set time type for de keyframes (percent or pixel).
        timeLine: 'bottom', // Optional: Determines if the timeline is at the top or bottom of the page
        elementKeyframes: [ // Array of elements with keyframes
            {
                element: exampleElement1, // Add an element to animate
		elementOffset: exampleElement3, //Optional: You can specify that the keyframes start from this element position on page.
                keyframeList: [ // Array of element keyframes
                    {
                        time: 0, // Position in the scroll for the keyframe
                        top: '200px', // Add styles for this keyframes as string
                        color: '#ff0000',
                        left: '200px',
                        'background-color': '#463311',
                        transform: 'scale(1.1)'
                    },
                    {
                        time: 15000,
                        top: '100px',
                        left: '500px',
                        'background-color': '#00ffff',
                        color: '#00ff00',
                        transform: 'scale(2)'
                        
                    },
                    {
                        time: 3000,
                        top: '300px',
                        color: '#0000ff',
                        'background-color': '#cccccc',
                        transform: 'scale(1.5)'
                    }
                ]
            }
        ]
    });
