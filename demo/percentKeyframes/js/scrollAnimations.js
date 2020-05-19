window.addEventListener('load', onLoad);

var designTitle;

function onLoad() {
    exampleElement1 = document.querySelector('#exampleElement1');
    exampleElement2 = document.querySelector('#exampleElement2');
    exampleElement3 = document.querySelector('#exampleElement3');

    // Keyframes configuration
    var keyframes = new Keyframes({

        timeType: 'percent',
        timeLine: 'top',
        elementKeyframes: [
            {
                element: exampleElement1,
                keyframeList: [
                    {
                        time: 0,
                        top: '200px',
                        color: '#ff0000',
                        left: '200px',
                        background: '#463311',
                        transform: 'scale(1.1)'
                    },
                    {
                        time: 90,
                        top: '100px',
                        left: '500px',
                        background: '#00ffff',
                        color: '#00ff00',
                        transform: 'scale(2)'
                        
                    },
                    {
                        time: 80,
                        top: '300px',
                        color: '#0000ff',
                        background: '#cccccc',
                        transform: 'scale(1.5)'
                    }
                ]
            },
            {
                element: exampleElement2,
                elementOffset: exampleElement3,
                keyframeList: [
                    {
                        time: 0,
                        top: '200px',
                        color: '#000000',
                        left: '0',
                        transform: 'rotate(0)',
                        position: 'fixed'
                    },
                    {
                        time: 100,
                        top: '100px',
                        left: '200px',
                        color: '#0000ff',
                        transform: 'rotate(3000deg)',
                        position: 'fixed'

                        
                    },
                    {
                        time: 50,
                        top: '200px',
                        color: '#ffffff',
                        background: '#000000',
                        position: 'fixed'

                    }
                ]
            }
        ]
    });
}
