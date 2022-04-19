import * as React from "react";
import * as ReactBeautifulDnD from "react-beautiful-dnd-next";
import Tree, {
  ItemId,
  moveItemOnTree,
  mutateTree,
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeItem,
  TreeSourcePosition
} from "@atlaskit/tree";

type State = {
  tree: TreeData;
};

class PatchTree extends Tree {
  render() {
    const { isNestingEnabled } = this.props;
    const renderedItems = this.renderItems();

    return (
      <ReactBeautifulDnD.DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragUpdate={this.onDragUpdate}
      >
        <ReactBeautifulDnD.Droppable
          droppableId="tree"
          isCombineEnabled={isNestingEnabled}
          ignoreContainerClipping
        >
          {dropProvided => {
            const finalProvided = this.patchDroppableProvided(dropProvided);

            return (
              <div
                ref={finalProvided.innerRef}
                style={{ pointerEvents: "auto" }}
                onTouchMove={this.onPointerMove}
                onMouseMove={this.onPointerMove}
                {...finalProvided.droppableProps}
              >
                {renderedItems}
                {dropProvided.placeholder}
              </div>
            );
          }}
        </ReactBeautifulDnD.Droppable>
      </ReactBeautifulDnD.DragDropContext>
    );
  }
}

export class App extends React.Component<unknown, State> {
  state = {
    tree: {
      rootId: "1",
      items: {
        "1": {
          id: "1",
          children: ["1-1", "1-2"],
          hasChildren: true,
          isExpanded: true,
          isChildrenLoading: false,
          data: {
            title: "root"
          }
        },
        "1-1": {
          id: "1-1",
          children: ["1-1-1", "1-1-2"],
          hasChildren: true,
          isExpanded: true,
          isChildrenLoading: false,
          data: {
            title: "First parent"
          }
        },
        "1-2": {
          id: "1-2",
          children: ["1-2-1", "1-2-2"],
          hasChildren: true,
          isExpanded: true,
          isChildrenLoading: false,
          data: {
            title: "Second parent"
          }
        },
        "1-1-1": {
          id: "1-1-1",
          children: [],
          hasChildren: false,
          isExpanded: false,
          isChildrenLoading: false,
          data: {
            title: "Child one"
          }
        },
        "1-1-2": {
          id: "1-1-2",
          children: [],
          hasChildren: false,
          isExpanded: false,
          isChildrenLoading: false,
          data: {
            title: "Child two"
          }
        },
        "1-2-1": {
          id: "1-2-1",
          children: [],
          hasChildren: false,
          isExpanded: false,
          isChildrenLoading: false,
          data: {
            title: "Child three"
          }
        },
        "1-2-2": {
          id: "1-2-2",
          children: [],
          hasChildren: false,
          isExpanded: false,
          isChildrenLoading: false,
          data: {
            title: "Child four"
          }
        }
      }
    }
  };

  renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot
  }: RenderItemParams) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {item.data ? item.data.title : ""}
    </div>
  );

  onExpand = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: true })
    });
  };

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false })
    });
  };

  onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition
  ) => {
    const { tree } = this.state;

    if (!destination) {
      return;
    }

    const newTree = moveItemOnTree(tree, source, destination);
    this.setState({
      tree: newTree
    });
  };

  render() {
    const { tree } = this.state;

    return (
      <div style={{ fontSize: 14 }}>
        <PatchTree
          tree={tree}
          renderItem={this.renderItem}
          onExpand={this.onExpand}
          onCollapse={this.onCollapse}
          onDragEnd={this.onDragEnd}
          offsetPerLevel={16}
          isDragEnabled
        />
      </div>
    );
  }
}
