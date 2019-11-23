////////////////////////////////////////////////////////////////////
// step 1: The createElement Function
////////////////////////////////////////////////////////////////////

// element is an object with type and props so we need a function to create the object
function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props, // spread operator
			children : children.map(child => // rest operator so returns array
				typeof child === "object" ? child : createTextElement(child)
			)
		}
	}
}
// wrap everything that is not an object in its own element and create a special Text_Element for them
function createTextElement(text) { 
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: []
		}
	}
}

// give name to library
const Didact = {
	createElement,
}

// jsx Didact.createElement. Babel with transpile jsx with function we define
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)

const element = Didact.createElement(
	"div",
	{id: "foo"},
	Didact.createElement("a", null, "bar"),
	Didact.createElement("b")
)



const container = document.getElementById("root");


////////////////////////////////////////////////////////////////////
// Step 2: rewrite render function
////////////////////////////////////////////////////////////////////
// ReactDOM.render(element, container)

// create dom node using element type and append new node to container if element is type text_element create a text node intead
function render(element, container) {
	const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);

	element.props.children.forEach(child => render(child, dom)); // recursively do that for each child

	// assing element props to the node
	const isProperty = key => key !== "children"
	Object.keys(element.props).filter(isProperty).forEach(name => {
		dom[name] = element.props[name]
	})


	container.appendChild(dom);
}