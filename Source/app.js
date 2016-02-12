var tree = document.getElementById('treeview');
var data = {
	"director": {
		"level": 1, "maxAmount": 1, "persons": ["John"] 
	},
	"deputy": {
		"level": 2, "maxAmount": 3, "persons": ["Eric", "Steeve", "Margaret"] 
	},
	"contractor": {
		"level": 3, "maxAmount": 4, "persons": ["Tom", "Diana", "CT", "Denis"] 
	},
	"courier": {
		"level": 4, "maxAmount": 5, "persons": ["Sarah", "Bob", "Rob", "Chris", "Arnold"] 
	}
};
/*var data = {
	"director": {
		"level": 1, "maxAmount": 1, "persons": ["John"], "deputy": {
			"level": 2, "maxAmount": 3, "persons": ["Eric", "Steeve", "Margaret"], "contractor": {
				"level": 3, "maxAmount": 4, "persons": ["Tom", "Diana", "CT", "Denis"], "courier": {
					"level": 4, "maxAmount": 5, "persons": ["Sarah", "Bob", "Rob", "Chris", "Arnold"] 
				} 
			}, 
		}, 
	}
};*/

(function createTreeList(domElement, treeNode) {
    var ul = document.createElement('ul');
    domElement.appendChild(ul);
    
    for (i in treeNode) {
        var li = document.createElement('li');
        li.innerHTML = i;
        
        var ulChild = document.createElement('ul');
        for (j in treeNode[i].persons){
        	var liChild = document.createElement('li');
        	liChild.innerHTML = '<img onclick="moveEl(event, 1)" class="moveUp" src="resources/images/stockIndexUp.png" /> ' + treeNode[i].persons[j] + ' <img onclick="moveEl(event, -1)" class="moveDown" src="resources/images/stockIndexDown.png" />';
        	ulChild.appendChild(liChild);
        }
        //ulChild.setAttribute("class", "childUl");
        li.setAttribute("class", treeNode[i].level);
        li.appendChild(ulChild);
        ul.appendChild(li);
    }
}(tree, data));

function moveEl(event, direction) {
	console.log("Event type: " + event.type + " Direction: "+ direction);
	
	var currentEl = event.target.parentElement;
	var parentNode = currentEl.parentNode.parentNode;
	var parentNodeClassName = parentNode.className;
	
	if(direction==1 && parentNodeClassName != "1"){
		currentEl.parentNode.appendChild(parentNode.previousSibling.firstElementChild.firstElementChild);
		parentNode.previousSibling.firstElementChild.appendChild(currentEl);	
	}
	if(direction==-1 && parentNodeClassName != "4"){
		currentEl.parentNode.appendChild(parentNode.nextSibling.firstElementChild.firstElementChild);
		parentNode.nextSibling.firstElementChild.appendChild(currentEl);	
	}
}