// Definition React element: object with 2 properties: types and props

// define react element and rewrite in vanilla JS. Babel transpiles jsx to js 
// const element = <h1 title="my react app">Hi there</h1>
//  creates object from its arguments
const element = React.createElement({
	type: "h1", // type of DOM node we want to create (tagname) can also be a function
	props: { // object from jsx attribute and has special array prop: children
		title: "my react app",
		childred: "Hi there",
	},
)

// get node from DOM
const container = document.getElementById("root");

// render element in container
// ReactDom.render(element, container);

const node = document.createElement(element.type); // create node
node["title"] = element.props.title; // assign all element props to node

// create nodes for children (Text node for string instead of innerText
const text = document.createTextNode("");
text["nodeValue"] = element.props.children;

// append text node to h1 and 1 container
node.appendChild(text)
container.appendChild(node)