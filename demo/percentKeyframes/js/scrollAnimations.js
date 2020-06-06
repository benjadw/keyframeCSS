window.addEventListener('load', onLoad);

var designTitle;

function onLoad() {
    exampleElement1 = document.querySelector('#exampleElement1');
    exampleElement2 = document.querySelector('#exampleElement2');
    exampleElement3 = document.querySelector('#exampleElement3');
    exampleBackground1 = document.querySelector('#exampleBackground1');
    exampleBackground2 = document.querySelector('#exampleBackground2');
    exampleBackground3 = document.querySelector('#exampleBackground3');

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
                        transform: 'scale(1.1)',
                        "font-size": '6vh'
                    },
                    {
                        time: 90,
                        top: '100px',
                        left: '500px',
                        background: '#00ffff',
                        color: '#00ff00',
                        transform: 'scale(2)',
                        "font-size": '8vh'

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
            },
            {
                element: exampleBackground1,
                keyframeList: [
                    {
                        time: 0,
                        top: '60%',
                        background: '#ffff00',
                        left: '0',
                        transform: 'rotate(0)',
                        position: 'fixed'
                    },
                    {
                        time: 30,
                        top: '50%',
                        left: '0',
                        color: '#ffffff',
                        background: '#ffff00',
                        position: 'fixed'

                    },
                    {
                        time: 50,
                        top: '40%',
                        left: '0',
                        color: '#ffffff',
                        background: '#ffff00',
                        position: 'fixed',
                        transform: 'rotate(0) scale(1)'
                    },
                    {
                        time: 90,
                        top: '40%',
                        left: '0',
                        color: '#ffffff',
                        background: '#ffff00',
                        position: 'fixed',
                        transform: 'rotate(540deg) scale(.1)'
                    },
                    {
                        time: 100,
                        top: '40%',
                        left: '0',
                        color: '#ffffff',
                        background: '#ffff00',
                        position: 'fixed',
                        transform: 'rotate(740deg) scale(.01)'
                    }
                ]
            },
            {
                element: exampleBackground2,
                keyframeList: [
                    {
                        time: 0,
                        top: '70%',
                        background: '#ff0000',
                        left: '0',
                        transform: 'rotate(0)',
                        position: 'fixed'
                    },
                    {
                        time: 30,
                        top: '50%',
                        left: '0',
                        color: '#ffffff',
                        background: '#ff0000',
                        position: 'fixed'

                    },
                    {
                        time: 50,
                        top: '30%',
                        left: '0',
                        color: '#ffffff',
                        background: '#ff0000',
                        position: 'fixed',
                        transform: 'rotate(0) scale(1)'
                    },
                    {
                        time: 90,
                        top: '30%',
                        left: '0',
                        color: '#ffffff',
                        background: '#ff0000',
                        position: 'fixed',
                        transform: 'rotate(540deg) scale(.1)'
                    },
                    {
                        time: 100,
                        top: '30%',
                        left: '0',
                        color: '#ffffff',
                        background: '#ff0000',
                        position: 'fixed',
                        transform: 'rotate(740deg) scale(.01)'
                    }
                ]
            },
            {
                element: exampleBackground3,
                keyframeList: [
                    {
                        time: 0,
                        top: '90%',
                        background: '#00ff00',
                        left: '0',
                        transform: 'rotate(0)',
                        position: 'fixed'
                    },
                    {
                        time: 30,
                        top: '50%',
                        left: '0',
                        color: '#ffffff',
                        background: '#00ff00',
                        position: 'fixed'

                    },
                    {
                        time: 50,
                        top: '10%',
                        left: '0',
                        color: '#ffffff',
                        background: '#00ff00',
                        position: 'fixed',
                        transform: 'rotate(0) scale(1)'
                    },
                    {
                        time: 90,
                        top: '10%',
                        left: '0',
                        color: '#ffffff',
                        background: '#00ff00',
                        position: 'fixed',
                        transform: 'rotate(540deg) scale(.1)'
                    },
                    {
                        time: 100,
                        top: '10%',
                        left: '0',
                        color: '#ffffff',
                        background: '#00ff00',
                        position: 'fixed',
                        transform: 'rotate(740deg) scale(.01)'
                    }
                ]
            }
        ]
    });
}
