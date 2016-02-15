var socket = io.connect('http://localhost:8080');
socket.on('firstcall', function(data) {
	console.log('json data received');
	//var treeNode = data;
	//buildTree(treeNode, tree);
	buildTree(data);
	//unsubscribe from first json upload listener
	socket.removeAllListeners('firstcall');
});

function getPositions(data) {
	var positions = new Array();
	for(var i in data){
		positions.push(i)
	}
	return positions;
}

function buildTree(data) {
	var ChildUl = React.createClass({
		render: function() {
			var self = this;
			return (
				<ul>
					{this.props.persons.map(function(person){
						return <li key={person} className={self.props.level}> <img onClick={moveElement.bind(null, self, 1)} className="moveUp" src="../resources/images/stockIndexUp.png" onmouseover="" style={{cursor: 'pointer'}}/>
						{person} <img onClick={moveElement.bind(null, self, -1)} className="moveDown" src="../resources/images/stockIndexDown.png" onmouseover="" style={{cursor: 'pointer'}}/></li>
					})}
				</ul>
			);
		}
	});
	
	var ParentUl = React.createClass({
	  render: function() {
	    return (
	      	<ul>
	      		{getPositions(data).map(function(position){
					return <li key={position}> {position} <ChildUl persons={data[position].persons} level={data[position].level}/> </li>
				})}	
	      	</ul>
	    );
	  }
	});

	ReactDOM.render(
		<ParentUl />,
		document.getElementById('treeview')
	);
}

var moveElement = function (el, direction) {
	//console.log("Event type: " + event.type + " Direction: "+ direction);
	
	var currentEl = ReactDOM.findDOMNode(el);
	var parentNode = ReactDOM.findDOMNode(el).parentNode;
	var parentNodeClassName = parentNode.className;
	
	if(direction==1 && parentNodeClassName != "1"){
		ReactDOM.findDOMNode(el).appendChild(parentNode.previousSibling.firstElementChild.firstElementChild);
		parentNode.previousSibling.firstElementChild.appendChild(currentEl);	
	}
	if(direction==-1 && parentNodeClassName != "4"){
		ReactDOM.findDOMNode(el).appendChild(parentNode.nextSibling.firstElementChild.firstElementChild);
		parentNode.nextSibling.firstElementChild.appendChild(currentEl);	
	}
	loopOverChildren(ul);
}

function loopOverChildren(ul) {
	var obj = {
		director: {
			level: 1, 
			persons: new Array()
		},
		deputy: {
			level: 2, 
			persons: new Array()
		},
		contractor: {
			level: 3, 
			persons: new Array()
		},
		courier: {
			level: 4, 
			persons: new Array() 
		}
	};
	for(var i=0; i< ul.childNodes.length; i++){
		//get firstchild of general ul
		var position = ul.childNodes[i].firstChild.data;
		var childLis = ul.childNodes[i].firstElementChild.childNodes;
		if(position=="director"){
			//get sub li elements
			for(var j=0; j<childLis.length; j++){
				var person = childLis[j].innerText;
				obj.director.persons.push(person);
			}
		}
		if(position=="deputy"){
			for(var j=0; j<childLis.length; j++){
				var person = childLis[j].innerText;
				obj.deputy.persons.push(person);
			}	
		}
		if(position=="contractor"){
			for(var j=0; j<childLis.length; j++){
				var person = childLis[j].innerText;
				obj.contractor.persons.push(person);
			}	
		}
		if(position=="courier"){
			for(var j=0; j<childLis.length; j++){
				var person = childLis[j].innerText;
				obj.courier.persons.push(person);
			}
		}
	}
	saveJsonChanges(obj);
}

function saveJsonChanges(obj) {
	socket.emit('message', JSON.stringify(obj));
}
