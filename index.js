// Get the necessary elements
const vertexBtn = document.getElementById('vertexBtn');
const edgeBtn = document.getElementById('edgeBtn');
const bfsBtn = document.getElementById('bfsBtn');
const graphSvg = document.getElementById('graphSvg');

// Array to store vertices with their coordinates
let vertices = [];
let edges = [];
let isAddingVertex = false;
let isAddingEdge = false;
let isPerformingBFS = false;
let selectedVertex = null;
let graph = {};
const locationOfVerticies = {}

// Function to handle click event for adding a vertex
function addVertex(event) {
    if (!isAddingVertex) return;

    const svgRect = graphSvg.getBoundingClientRect();
    console.log(svgRect);
    const xPos = event.clientX - svgRect.left;
    const yPos = event.clientY - svgRect.top;

    // Create vertex object
    const vertex = {
        x: xPos,
        y: yPos,
        id: vertices.length + 1 // Incrementing vertex ID
    };
    locationOfVerticies[vertices.length + 1] = []
    locationOfVerticies[vertices.length + 1].push(xPos)
    locationOfVerticies[vertices.length + 1].push(yPos)

    graph[vertices.length + 1] = [];



    // Push vertex object into the vertices array
    vertices.push(vertex);

    // Create text element for vertex label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', xPos);
    text.setAttribute('y', yPos);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '16');
    text.textContent = vertices.length;

    // Create circle element for vertex
    const vertexCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    vertexCircle.setAttribute('cx', xPos);
    vertexCircle.setAttribute('cy', yPos);
    vertexCircle.setAttribute('r', '20');
    vertexCircle.setAttribute('fill', '#3B3B98');
    vertexCircle.setAttribute('stroke', '#3B3B98');
    // vertexCircle.setAttribute('stroke-width', '2');
    vertexCircle.setAttribute('id', `circle-${vertex.id}`);

    // Append elements to SVG
    graphSvg.appendChild(vertexCircle);
    graphSvg.appendChild(text);
}
// Function to handle click event for adding an edge
function addEdge(event) {
    if (!isAddingEdge) return;

    const svgRect = graphSvg.getBoundingClientRect();
    const xPos = event.clientX - svgRect.left;
    const yPos = event.clientY - svgRect.top;

    // Find the vertex closest to the click position
    let closestVertex = vertices.reduce((closest, vertex) => {
        const distance = Math.sqrt(Math.pow(xPos - vertex.x, 2) + Math.pow(yPos - vertex.y, 2));
        if (distance < closest.distance) {
            return { vertex, distance };
        }
        return closest;
    }, { vertex: null, distance: Infinity }).vertex;

    // If a vertex is found and it's not the same as the selected vertex, create an edge
    if (closestVertex) {
        if (!selectedVertex) {
            selectedVertex = closestVertex;
        } else if (selectedVertex !== closestVertex) {

            const edge = {
                start: selectedVertex,
                end: closestVertex,
                id: edges.length + 1
            };

            graph[selectedVertex.id].push(closestVertex.id);
            graph[closestVertex.id].push(selectedVertex.id);

            edges.push(edge);
            console.log(edges);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${selectedVertex.x},${selectedVertex.y} L${closestVertex.x},${closestVertex.y}`);
            path.setAttribute('stroke', '#2C3A47');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('id', `edge-${edges.length}`);
            path.setAttribute('stroke-miterlimit', '10');
            path.setAttribute('fill', 'none');
            // Append the edge path before vertices to ensure it appears below them
            graphSvg.insertBefore(path, graphSvg.firstChild);

            selectedVertex = null;
        }
    }
}

function showBetterAnimation(currentNode, adjNode) {
    let edgeId;
    let currEdge = null;
    for (let edge of edges) {
        if ((edge.start.id == currentNode && edge.end.id == adjNode) || (edge.start.id == adjNode && edge.end.id == currentNode)) {
            edgeId = edge.id;
            currEdge = edge;
        }
    }

    const edgeElement = document.getElementById(`edge-${edgeId}`);

    if (edgeElement) {
        // const graphSvg = document.getElementById('graphSvg');

        // Query the original line
        // const edgeElement = document.getElementById('edgeElement');

        // Get the total length of the original line
        const totalLength = edgeElement.getTotalLength();

        // Create a new line for overlay
        const overlayLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        // overlayLine.setAttribute('d', `M${edgeElement.x},${edgeElement.y} L${edgeElement.x},${edgeElement.y}`);
        // overlayLine.setAttribute('d',`M${edgeElement.getAttribute('x1')},${edgeElement.getAttribute('y1')} L${edgeElement.getAttribute('x1')},${edgeElement.getAttribute('y1')}`)
        // overlayLine.setAttribute('stroke', '#2C3A47');
        // overlayLine.setAttribute('stroke-width', '1.5');
        // overlayLine.setAttribute('id', `edge-${edges.length}`);
        // overlayLine.setAttribute('stroke-miterlimit', '10');
        // overlayLine.setAttribute('fill', 'none');

        overlayLine.setAttribute('stroke', 'green');
        overlayLine.setAttribute('stroke-width', '5');
        // overlayLine.setAttribute('d',`M${currEdge.start.x},${currEdge.start.y} L${currEdge.start.x},${currEdge.start.y}`)
        let flag = false;
        if (currEdge.start.id != currentNode) {
            flag = true;
            [currEdge.start, currEdge.end] = [currEdge.end, currEdge.start]
        }
        overlayLine.setAttribute('x1', currEdge.start.x);
        overlayLine.setAttribute('y1', currEdge.start.y);
        overlayLine.setAttribute('x2', currEdge.start.x); // Initialize x2 to match the original line's starting point
        overlayLine.setAttribute('y2', currEdge.start.y); // Initialize y2 to match the original line's starting point
        // Append the edge overlayLine before vertices to ensure it appears below them
        graphSvg.insertBefore(overlayLine, graphSvg.firstChild);

        // Animate the overlay line
        let currentLength = 0;
        const animationDuration = 5000; // Animation duration in milliseconds
        const animationSteps = 100; // Number of steps
        const stepLength = totalLength / animationSteps; // Length of each step
        const stepDuration = animationDuration / animationSteps; // Duration for each step

        function animateOverlayLine() {
            currentLength += stepLength;
            let point = edgeElement.getPointAtLength(currentLength);
            if(flag){
            point = edgeElement.getPointAtLength(totalLength - currentLength);

            }
            overlayLine.setAttribute('x2', point.x);
            overlayLine.setAttribute('y2', point.y);



            // Set the stroke color based on the current length
            const percent = currentLength / totalLength;
            const red = 255 * percent;
            const green = 255 - (255 * percent);
            overlayLine.setAttribute('stroke', `rgb(${red}, ${green}, 0)`);

            if (currentLength < totalLength) {
                setTimeout(animateOverlayLine, stepDuration);
            }
        }

        // Trigger the animation
        animateOverlayLine();
    }

}


function showAnimation(currentNode, adjNode) {
    // Construct the edge ID based on the nodes

    let edgeId;
    let currEdge = null;
    for (let edge of edges) {
        if ((edge.start.id == currentNode && edge.end.id == adjNode) || (edge.start.id == adjNode && edge.end.id == currentNode)) {
            edgeId = edge.id;
            currEdge = edge;
        }
    }
    console.log("edge id : ");
    console.log(edgeId);
    // Find the SVG <path> element representing the edge
    const edgeElement = document.getElementById(`edge-${edgeId}`);

    if (edgeElement) {
        // Create an <animate> element to animate the stroke color
        const animateElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animateElement.setAttribute('attributeName', 'stroke');
        animateElement.setAttribute('from', 'black');
        animateElement.setAttribute('to', 'green');
        animateElement.setAttribute('dur', '1s');
        animateElement.setAttribute('fill', 'freeze');
        animateElement.setAttribute('id', `animate-${edgeId}`);

        // Append the <animate> element to the edge <path> element
        edgeElement.appendChild(animateElement);
        // Create <circle> element representing the moving object

        const pathStartPoint = edgeElement.getPointAtLength(0);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', 0); // Adjust as per your vertex data
        circle.setAttribute('cy', 0); // Adjust as per your vertex data
        circle.setAttribute('r', '7');
        circle.setAttribute('fill', 'tomato');
        circle.setAttribute('stroke', 'tomato');
        // circle.setAttribute('stroke-width', '2');
        circle.setAttribute('id', `circle_${edgeId}`);

        // Append <circle> element to SVG


        edgeElement.parentNode.insertBefore(circle, edgeElement.nextSibling);

        const startTime = performance.now(); // Get the start time of the animation
        const animationDuration = 5000; // Animation duration in milliseconds
        const pathLength = edgeElement.getTotalLength();
        function animateCircle(timestamp) {
            const elapsedTime = timestamp - startTime;
            const progress = elapsedTime / animationDuration;
            let point = edgeElement.getPointAtLength(progress * pathLength);
            // This is we are doing because what If user have create vertex in wrong diraction , i.e, they selected edge v-u , but when we are doing BFS then it is posible that we are standing at u and our adjcent node is v , so we have to go there and we have to show animation from u to v , but in our case start point of edge is v , so animation will be shown but from the v to u , not u to v .... so for that we have to reverse that animation and that is why we are doing this .
            // for understanding important of it you can do like first remove below If and then create two nodes 1 and 2. draw edge from 2 to 1. and then press on BFS travesal , what are you seiing? I think now you are understood...
            if (currEdge.start.id != currentNode) {
                point = edgeElement.getPointAtLength(pathLength - progress * pathLength);
            }


            circle.setAttribute("cx", point.x);
            circle.setAttribute("cy", point.y);

            if (progress < 1) {
                requestAnimationFrame(animateCircle);
            }
        }

        requestAnimationFrame(animateCircle);
    }
}




async function bfs(graph, startNode) {
    console.log(graph);
    // Use a queue to store nodes to be explored
    const queue = [startNode];
    // Keep track of visited nodes to avoid revisiting
    const visited = [];

    visited.push(startNode);
    while (queue.length > 0) {
        // Remove the first node from the queue
        const currentNode = queue.shift();
        console.log(currentNode);

        for (const adjNode of graph[currentNode]) {
            if (!visited.includes(adjNode)) {

                // showAnimation(currentNode, adjNode);
                showBetterAnimation(currentNode, adjNode);
                await new Promise(resolve => setTimeout(resolve, 5000));
                // Mark the edge as visited


                console.log(currentNode + "->" + adjNode + "->");
                queue.push(adjNode);
                visited.push(adjNode);
            }
        }


    }
}


vertexBtn.addEventListener('click', () => {
    isAddingVertex = true;
    isAddingEdge = false;
    isPerformingBFS = false;
    graphSvg.removeEventListener('click', addEdge);
    graphSvg.addEventListener('click', addVertex);
});

// Event listener to add edge on click
edgeBtn.addEventListener('click', () => {
    isAddingEdge = true;
    isAddingVertex = false;
    isPerformingBFS = false;
    graphSvg.removeEventListener('click', addVertex);
    graphSvg.addEventListener('click', addEdge);
});

// Event listener to perform BFS on click
bfsBtn.addEventListener('click', () => {
    isPerformingBFS = true;
    isAddingVertex = false;
    isAddingEdge = false;
    graphSvg.removeEventListener('click', addVertex);
    graphSvg.removeEventListener('click', addEdge);

    const startingNode = vertices[0].id; // Or use the ID to access by vertex ID
    bfs(graph, startingNode);

});

