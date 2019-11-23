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
// Step 4: rewrite render function for fibre tree to make it easy to find the next unit of work
////////////////////////////////////////////////////////////////////
// once rendering we will not stop until we have renedered the complete element tree. if the element tree is big, it may block the main thread for too long and high priority stuff such as handling user input will have to wait until the render finishes. therefore we break the work into small units and after we finish each unit we will let the browser interrupt the rendering if there is anything else that needs to be done.

// create dom node using element type and append new node to container if element is type text_element create a text node intead
function createDom(fiber) {
	const dom = fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);
	// assing element props to the node
	const isProperty = key => key !== "children"
	Object.keys(element.props).filter(isProperty).forEach(name => {
		dom[name] = element.props[name]
	})
	return dom
}

function commitRoot() {
	// add nodes to dom
}

// set nextUnitOfWork to the root of the fiber tree
function render (element, container) {
	wipRoot = {
		dom: container,
		props: {
			children: [element],
		}
	}
	nextUnitofWork = wipRoot;
}


//	element.props.children.forEach(child => render(child, dom)); // recursively do that for each child
	let nextUnitofWork = null;
	let wiproote = null;

	function workLoop(deadline) {
		let shouldYield = false;
		while (nextUnitofWork && !shouldYield) {
			// start using loop, perform function performs the work and returns the next unit of work when browser is ready
			nextUnitofWork = performUnitOfWork(nextUnitofWork)
			shouldYield = deadline.timeRemaining() < 1;
		}

		if (!nextUnitofWork && wipRoot) {
			commitRoot();
		}
		
		requestIdleCallback(workLoop) // like setTimeout but browser will run the callback when the main thread is idle.
	}

	requestIdleCallback(workLoop)
	

////////////////////////////////////////////////////////////////
// step 5 render and commit phases
////////////////////////////////////////////////////////////////
// each time we work on an element we add a new node to the dom. the browser could interrup our work an the UI would be incomplete. so we keep track of the root of the fiber tree and call it work in progress root in function render. once we finish there is not next unit of work and we commit the entire fiber tree to the dom in the commitRoot Function where we recursively append all the nodes to the dom.

	function performUnitOfWork(fiber) {
			// 1. add the element to the dom
			
			if (!fiber.dom) {
				fiber.dom = createDom(fiber); // keep track of dom in fiber.dom property
			}

		
			// 2. for each of elements child create a new fiber

			const elements = fiber.props.children;
			let index = 0
			let prevSibling = null

			while (index < elements.length) {
				const element = elements[index]
				const newFiber = {
					type: element.type,
					props: element.props,
					parent: fiber,
					dom: null
				}
				// add child to fiber tree as child or sibling
				if (index === 0) {
					fiber.child = newFiber
				} else {
					prevSibling.sibling = newFiber
				}
				prevSibling = newFiber;
				index++; 
			}

			// 3. select the next unit of work. first try with child, then sibling then with uncle
			if (fiber.child) {
				return fiber.child
			}
			let nextFiber = fiber;
			while (nextFiber) {
				if (nextFiber.sibling) {
					return nextFiber.sibling
				}
				nextFiber = nextFiber.parent
			}

	}

	container.appendChild(dom);
}