(function() {
    const widget = document.createElement('div');
    widget.style.position = 'fixed';
    widget.style.bottom = '20px';
    widget.style.right = '20px';
    widget.style.padding = '10px';
    widget.style.background = '#ffcc00';
    widget.style.borderRadius = '5px';
    widget.style.cursor = 'pointer';
    widget.innerText = 'Click Me!';

    widget.addEventListener('click', function() {
        alert('Hello from the widget!');
    });

    document.body.appendChild(widget);
})();