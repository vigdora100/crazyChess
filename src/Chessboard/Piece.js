import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import PropTypes from 'prop-types';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { get} from 'lodash'
import  styled  from 'styled-components'

import { ItemTypes } from './helpers';

const Duration = styled.div`
   position: absolute;
   bottom: 3px;
   right: 3px;
`;

/* eslint react/prop-types: 0 */
export const renderChessPiece = ({
  dropTarget,
  square,
  targetSquare,
  waitForTransition,
  getSquareCoordinates,
  piece,
  width,
  pieces,
  transitionDuration,
  isDragging,
  sourceSquare,
  onPieceClick,
  allowDrag,
  customDragLayerStyles = {},
  phantomPieceStyles = {},
  pieceData,
  weaponsPieces,
}) => {
  const renderChessPieceArgs = {
    squareWidth: width / 8,
    isDragging,
    droppedPiece: dropTarget && dropTarget.piece,
    targetSquare: dropTarget && dropTarget.target,
    sourceSquare: dropTarget && dropTarget.source
  };
  console.log('pieceData: ' , pieceData)
  let isWeapon = get(pieceData,'isWeapon');
  return (
    <div
      data-testid={`${piece}-${square}`}
      onClick={() => onPiecCelick(piece)}
      style={{
        ...pieceStyles({
          isDragging,
          transitionDuration,
          waitForTransition,
          square,
          targetSquare,
          sourceSquare,
          getSquareCoordinates,
          getTranslation,
          piece,
          allowDrag
        }),
        ...phantomPieceStyles,
        ...customDragLayerStyles
      }}
    >
      {typeof pieces[piece] === 'function' ? (
        pieces[piece](renderChessPieceArgs)
      ) : (
        <svg viewBox={`1 1 43 43`} width={width / 8} height={width / 8}>
          <g>{isWeapon ?  weaponsPieces[piece] : pieces[piece] }
          </g>
        </svg>
      )}
      {isWeapon ? <Duration> {get(pieceData,'duration')}</Duration> : null }
    </div>
  );
};

class Piece extends Component {
  static propTypes = {
    piece: PropTypes.string,
    square: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.number,
    connectDragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    connectDragPreview: PropTypes.func,
    dropOffBoard: PropTypes.string,
    getSquareCoordinates: PropTypes.func,
    onDrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    transitionDuration: PropTypes.number,
    pieces: PropTypes.object,
    sourceSquare: PropTypes.string,
    targetSquare: PropTypes.string,
    waitForTransition: PropTypes.bool,
    setTouchState: PropTypes.func,
    onPieceClick: PropTypes.func,
    wasSquareClicked: PropTypes.func,
    allowDrag: PropTypes.func,
    pieceData: PropTypes.object,
    weaponsPieces: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    const shouldPieceUpdate =
      nextProps.dropTarget !== null ||
      nextProps.isDragging ||
      this.props.isDragging ||
      // if the position comes from the position prop, check if it is a different position
      this.props.sourceSquare !== nextProps.sourceSquare ||
      this.props.waitForTransition !== nextProps.waitForTransition ||
      // if the screen size changes then update
      this.props.width !== nextProps.width;

    if (shouldPieceUpdate) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    window.addEventListener('touchstart', this.props.setTouchState);

    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    });
  }

  componentWillUnmount() {
    window.removeEventListener('touchstart', this.props.setTouchState);
  }

  render() {
    const {
      square,
      targetSquare,
      waitForTransition,
      getSquareCoordinates,
      piece,
      width,
      pieces,
      transitionDuration,
      isDragging,
      connectDragSource,
      sourceSquare,
      dropTarget,
      onPieceClick,
      allowDrag,
      weaponsPieces,
      pieceData
    } = this.props;

    return connectDragSource(
      renderChessPiece({
        square,
        targetSquare,
        waitForTransition,
        getSquareCoordinates,
        piece,
        width,
        pieces,
        transitionDuration,
        isDragging,
        sourceSquare,
        dropTarget,
        onPieceClick,
        allowDrag,
        weaponsPieces,
        pieceData
      })
    );
  }
}

const pieceSource = {
  canDrag(props) {
    return (
      props.draggable &&
      props.allowDrag({ piece: props.piece, sourceSquare: props.square })
    );
  },
  beginDrag(props) {
    return {
      piece: props.piece,
      source: props.square,
      board: props.id
    };
  },
  endDrag(props, monitor) {
    const {
      setPosition,
      dropOffBoard,
      piece,
      square,
      onDrop,
      wasManuallyDropped,
      wasSquareClicked
    } = props;
    const dropResults = monitor.getDropResult();
    const didDrop = monitor.didDrop();

    // trash piece when dropped off board
    if (!didDrop && dropOffBoard === 'trash') {
      return setPosition({ sourceSquare: square, piece });
    }

    const board = monitor.getItem().board;
    const dropBoard = dropResults && dropResults.board;

    // check if target board is source board
    if (board === dropBoard && didDrop) {
      if (onDrop.length) {
        wasManuallyDropped(true);
        if (square !== 'spare') {
          wasSquareClicked(false);
        }

        // execute user's logic
        return onDrop({
          sourceSquare: square,
          targetSquare: dropResults.target,
          piece
        });
      }
      // set new position
      setPosition({
        sourceSquare: square,
        targetSquare: dropResults.target,
        piece
      });
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    dropTarget: monitor.getDropResult()
  };
}

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);

const isActivePiece = (square, targetSquare) =>
  targetSquare && targetSquare === square;

const getTransitionCoordinates = ({
  getSquareCoordinates,
  sourceSq,
  targetSq
}) => {
  const transitionCoordinates = getSquareCoordinates(sourceSq, targetSq);
  const { sourceSquare, targetSquare } = transitionCoordinates;

  return `translate(${sourceSquare.x - targetSquare.x}px, ${sourceSquare.y -
    targetSquare.y}px)`;
};

const getTranslation = ({
  waitForTransition,
  square,
  targetSquare,
  sourceSquare,
  getSquareCoordinates
}) => {
  return (
    isActivePiece(square, targetSquare) &&
    waitForTransition &&
    getTransitionCoordinates({
      getSquareCoordinates,
      sourceSq: sourceSquare,
      targetSq: targetSquare
    })
  );
};

const pieceStyles = ({
  isDragging,
  transitionDuration,
  waitForTransition,
  square,
  targetSquare,
  sourceSquare,
  getSquareCoordinates,
  getTranslation,
  piece,
  allowDrag
}) => ({
  opacity: isDragging ? 0 : 1,
  transform: getTranslation({
    waitForTransition,
    square,
    targetSquare,
    sourceSquare,
    getSquareCoordinates
  }),
  transition: `transform ${transitionDuration}ms`,
  position: 'relative',
  zIndex: 5,
  cursor: isDragging
    ? '-webkit-grabbing'
    : allowDrag({ piece, sourceSquare: square })
      ? '-webkit-grab'
      : 'not-allowed'
});
