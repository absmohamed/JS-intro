# Afternoon challenges - Event Listeners

## Part 1
Warning!
In *part1.html*, there is a div with id `warning` and a button with id `makeItRed`.

Your task is to make the background of the the warning div red when the button is clicked. Add node to the *part1.js* file to do this.

Hint: You can set style directly on a DOM node using the style property. For example:

```ele.style.color = "blue"```

where **ele** is a node in the DOM.

## Part 2
In *part2.html*, there is a picture of a cute cat, and a moustache. 

Your task is to implement an event listener that will put the moustache where the user clicks, so you can give the cute cat a moustache.

Implement the scaffolded function in *part2.js* to accomplish this, and use the function in an event listener.

Some tips:
* Two event properties that will help here are *pageX* and *pageY*. These return coordinates of the mouse. Use console.log to see what is returned.
* Two style properties you can use are *style.top* and *style.left*, although you could find another way to place the moustache. Note that you have to include units when you set these properties.