import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './canvas.css';
import { v1 as uuid } from 'uuid';
import Konva from 'konva';
import jsPDF from 'jspdf';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {
  Stage,
  Layer,
  Group,
  Circle,
  Text,
  Transformer,
  Rect,
  Arrow,
} from 'react-konva';
import FIcon from 'feather-icons-react';
import CloseIcon from '../../img/close.svg';
import { renderStrokeWidthOptions, renderSizeOptions} from './utils';
import { TextCircle } from './text.circle';
import { KImage, URLImage } from './image.konva';
import ExpandDown from '@material-ui/icons/ExpandMore';
import {
  TYPES,
  MODES,
  DEFAULT_CANVAS_MARGIN,
  CANVAS_MARGIN_TOP,
  pageSizes,
  EXPORT_TYPES,
  TEXT_PADDING,
} from './variables';
import DicomViewer from './dcmView';
import { DOCTOR_ROLE } from '../../constant';

const styles = {
  button: {
    height: 38,
  },
  buttonIcon: {
    marginRight: -18,
    fontSize: 20,
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#272727',
    zIndex: 10,
  },
  headerInner: {
    width: '100%',
    padding: '0 16px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  flexCenter: { display: 'flex', alignItems: 'center' },
  inputTextColor: {
    opacity: 0,
    position: 'relative',
    zIndex: 2,
  },
  selectTransparent: {
    backgroundColor: 'transparent',
    border: 0,
    color: '#fff',
    marginLeft: '4px',
  },
};

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.stageRef = React.createRef(); // ref <Stage>
    this.glossaryRef = React.createRef(); // ref bottom glossary section
    this.imageRef = React.createRef(); // ref <KImage />
    this.dicomViewerRef = React.createRef(); // ref DicomViewer
    this.layerRef = React.createRef(); // ref <Layer />
    this.state = {
      info: [], // from ocr json
      config: null, // from ocr json
      note: [], // from ocr json
      width: 0, // width of canvas layer
      height: 0, // height  of canvas layer
      scale: 1, // scale of image
      mode: null, // addText, select, draw, drawRect,
      textConfig: {
        fontSize: 18, // default size for add text
        strokeWidth: 3, // default indicator stroke width
        strokeStyle: '#00D4A4', // default indicator stroke color
        color: 'blue', // default note color
        glossaryColor: '#00D4A4', // default background glossary icon
      },
      selectedGlossaryId: null, // selecting glossary
      selectedTextId: null, // selecting text
      selectedGroupTextId: null, // selecting group text
      isPaint: false, // key on select indicator
      lastMouseX: 0, // last mouse position on select note indicator end
      lastMouseY: 0, //
      scrollTop: 0, // scroll top of Stage container
      isSelectIndicator: false, // is a text note selected
      newGlossary: { title: '', description: '' }, // value modal add glossary
      glossaryDialogOpen: false, // key open glossary dialog
      pageSize: 'A4', // page size export, default is A4,
      dicomData: '', // image url
    };
  }

  componentDidMount() {
    this.setData(this.props.data);
    this.repositionStage();
    // listen scroll event on canvas
    var scrollContainer = document.getElementById('image-canvas');
    document
      .querySelector('.konvajs-content')
      .querySelector('canvas')
      .classList.add('cornerstone-canvas');
    scrollContainer.addEventListener('scroll', this.repositionStage);
    window.addEventListener('resize', this.checkSize);
    // set first mode
    this.onChangeMode(MODES.SELECT);
    if (this.props.type === TYPES.XRAY) {
      setTimeout(() => {
        this.setState({ dicomData: this.getDicomData() });
      }, 2000);
    }
  }

  componentWillUnmount() {
    var scrollContainer = document.getElementById('image-canvas');
    scrollContainer.removeEventListener('scroll', this.repositionStage);
    window.removeEventListener('resize', this.checkSize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data && this.props.data) {
      this.setData(this.props.data);
    }
  }

  // set OCR data to state
  setData = (data) => {
    if (data) {
      this.setState(
        {
          info: data.info || [],
          config: data.config
            ? {
                ...data.config,
                bottomCircleRadius:
                  data.config.bottomCircleRadius ||
                  data.config.circleRadius * 2,
                bottomTextFontSize:
                  data.config.bottomTextFontSize || data.config.fontSize * 0.7,
              }
            : {},
          note:
            data.note.map((n, index) => {
              return {
                ...n,
                id: (n.id = uuid() + index),
              };
            }) || [],
          textConfig: {
            ...this.state.textConfig,
            glossaryColor:
              Array.isArray(data.info) && data.info.length
                ? data.info[0].icon.color
                : '#00D4A4',
          },
        },
        this.checkSize
      );
    }
  };

  getTextHeight = (content, width) => {
    const draftText = this.stageRef.current.findOne('#draftText');
    const scaleRatio = this.getScaleRatio();
    draftText.width(width * scaleRatio);
    draftText.text(content);
    return draftText.height() / scaleRatio;
  };

  getTextAreaBreakLine = () => {
    var t = document.getElementById('desc');
    return t.value.substr(0, t.selectionStart).split('\n').length;
  };

  getTextHeightWithBreakLine = () => {
    const { info } = this.state;
    const glossaryItemWidth = info?.length
      ? info[0].glossary.width
      : this.state.width;
    var t = document.getElementById('desc');
    const texts = t.value.substr(0, t.selectionStart).split('\n');
    return texts.reduce(
      (result, current) =>
        result + this.getTextHeight(current, glossaryItemWidth),
      0
    );
  };

  // handle zoom In/ Out of layer
  zoomStage = (layer, scaleBy) => {
    const oldScale = layer.scaleX();
    const pos = {
      x: layer.width() / 2,
      y: CANVAS_MARGIN_TOP,
    };
    const mousePointTo = {
      x: pos.x / oldScale - layer.x() / oldScale,
      y: pos.y / oldScale - layer.y() / oldScale,
    };

    const newScale = Math.max(0.05, oldScale * scaleBy);

    const newPos = {
      x: -(mousePointTo.x - pos.x / newScale) * newScale,
      y: -(mousePointTo.y - pos.y / newScale) * newScale,
    };

    const newAttrs = this.limitAttributes(layer, {
      ...newPos,
      scale: newScale,
    });

    layer.to({
      x: newAttrs.x,
      y: newAttrs.y,
      scaleX: newAttrs.scale,
      scaleY: newAttrs.scale,
      duration: 0.1,
    });

    layer.batchDraw();
    this.setScale(newAttrs.scale);
  };

  // reset zoom to initial value
  resetZoom = (layer) => {
    const oldScale = layer.scaleX();
    const pos = {
      x: layer.width() / 2,
      y: CANVAS_MARGIN_TOP,
    };
    const mousePointTo = {
      x: pos.x / oldScale - layer.x() / oldScale,
      y: pos.y / oldScale - layer.y() / oldScale,
    };

    const newScale = Math.max(0.05, 1);

    const newPos = {
      x: -(mousePointTo.x - pos.x / newScale) * newScale,
      y: -(mousePointTo.y - pos.y / newScale) * newScale,
    };

    const newAttrs = this.limitAttributes(layer, {
      ...newPos,
      scale: newScale,
    });

    layer.to({
      x: newAttrs.x,
      y: newAttrs.y,
      scaleX: newAttrs.scale,
      scaleY: newAttrs.scale,
      duration: 0.1,
    });

    layer.batchDraw();
    this.setScale(newAttrs.scale);
    this.scrollToTop();
  };

  // limit min/ max zoom of layer
  limitAttributes = (layer, newAttrs) => {
    const box = layer.findOne('Image').getClientRect();
    const minX = -box.width + layer.width() / 2;
    const maxX = layer.width() / 2;
    const x = Math.max(minX, Math.min(newAttrs.x, maxX));
    const minY = CANVAS_MARGIN_TOP;
    const maxY = layer.height() / 2;
    const y = Math.max(minY, Math.min(newAttrs.y, maxY));
    const scale = Math.max(0.05, newAttrs.scale);
    return { x, y, scale };
  };

  getScaleRatio = () => {
    const { config } = this.state;
    const { type, width} = this.props;
    const container = document.querySelector('.image-canvas');
    if (container) {
      const imageWidth = config && config.width;
      const _width = config
        ? container.offsetWidth - config.canvasMargin * 2
        : container.offsetWidth - DEFAULT_CANVAS_MARGIN * 2;

      const originalWidth = type === TYPES.PDF ? imageWidth : width;
      return type === TYPES.PDF ? _width / originalWidth : 1;
    }
    return 1;
  };

  // set width, height base on width / height ratio of image
  checkSize = () => {
    const { config } = this.state;
    const { type } = this.props;
    const container = document.querySelector('.image-canvas');
    const ratio =
      type === TYPES.PDF && config ? config.width / config.height : 1;
    const _width = config
      ? container.offsetWidth - config.canvasMargin * 2
      : container.offsetWidth - DEFAULT_CANVAS_MARGIN * 2;

    this.setSize({
      width: _width,
      height: _width / ratio,
    });
  };

  setSize = (s) => {
    this.setState({ width: s.width, height: s.height });
  };

  // set scale of canvas
  setScale = (scale, callback) => {
    this.setState({ scale }, () => {
      if (callback) {
        callback();
      }
    });
  };

  // handle on user select a note to edit
  onEditText = (textNode, id) => {
    // const scaleRatio = this.getScaleRatio();
    this.setTextConfig({
      color: textNode.fill(),
      fontSize: this.state.textConfig.fontSize,
    });
    this.setState({
      isSelectIndicator: false,
      mode: MODES.SELECT,
      selectedGlossaryId: null,
    });
    this.stageRef.current.container().style.cursor = 'default';
    const textPos = textNode.getAbsolutePosition();
    const stageBox = this.stageRef.current.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPos.x,
      y: stageBox.top + textPos.y,
    };
    textNode.hide();
    var textArea = document.createElement('textarea');
    textArea.id = 'textareaDraft';
    document.body.appendChild(textArea);
    textArea.value = textNode.text();
    textArea.style.position = 'absolute';
    textArea.style.zIndex = 1800;
    textArea.style.top = areaPosition.y + 'px';
    textArea.style.left = areaPosition.x + 'px';
    //* scale to ensure size match when canvas zoomed
    // calculate textArea equal to width of konva text element
    textArea.style.width =
      textNode.width() * this.state.scale - textNode.padding() * 2 + 'px';
    textArea.style.fontSize =
      this.state.textConfig.fontSize * this.state.scale + 'px';
    textArea.style.border = 'none';
    textArea.rows = '1';
    textArea.style.padding = '0px';
    textArea.style.margin = '0px';
    textArea.style.overflow = 'hidden';
    textArea.style.background = 'none';
    textArea.style.outline = 'none';
    textArea.style.resize = 'none';
    textArea.style.lineHeight = textNode.lineHeight() * this.state.scale;
    textArea.style.fontFamily = textNode.fontFamily();
    textArea.style.transformOrigin = 'left top';
    textArea.style.textAlign = textNode.align();
    textArea.style.color = textNode.fill();
    textArea.style.height = 'auto';
    textArea.style.height = textNode.height() - textNode.padding() * 2 + 'px';
    textArea.focus();
    textArea.addEventListener('blur', (e) => {
      const { note } = this.state;
      textNode.text(textArea.value);
      textNode.height(textArea.scrollHeight);
      const absScale = textNode.getAbsoluteScale();
      textNode.scaleY(textNode.scaleY() / absScale.y);
      textNode.scaleX(textNode.scaleX() / absScale.x);
      const newNote = note.map((n) => {
        if (n.id === id) n.message.content = textArea.value;
        return n;
      });
      document.body.removeChild(textArea);
      this.setState({ note: newNote });
      textNode.show();
      this.layerRef.current.batchDraw();
    });
  };

  onReset = () => {
    this.props.onReset();
  };

  onClear = () => {
    this.setState({ info: [], note: [] });
  };

  onDecreaseGlossaryIconSize = () => {
    const { config } = this.state;
    this.setState({
      config: {
        ...config,
        circleRadius: config.circleRadius - 1,
      },
    });
  };

  onIncreaseGlossaryIconSize = () => {
    const { config } = this.state;
    this.setState({
      config: {
        ...config,
        circleRadius: config.circleRadius + 1,
      },
    });
  };

  onExport = async (type) => {
    const { notifyExportingRequest, notifyExportedRequest } = this.props;
    notifyExportingRequest();
    await this.onImageProcess(type);
    notifyExportedRequest();
  };

  onImageProcess = (type) => {
    return new Promise((resolve, reject) => {
      const { pageSize } = this.state;
      const pageRatio = pageSizes[pageSize][0] / pageSizes[pageSize][1];
      this.resetZoom(this.layerRef.current);
      this.onCloseExportMenu();
      setTimeout(() => {
        this.clearSelectState(() => {
          const { config } = this.state;
          const stage = this.stageRef.current;
          const glossaryH = this.getGlossaryHeight();
          const width = this.imageRef.current.width();
          const height = this.imageRef.current.height() + glossaryH;
          const ratio = width / height;
          var pdf = new jsPDF('p', 'px', pageSize.toLowerCase(), true);
          const _height = pdf.internal.pageSize.getHeight();
          const _width = pdf.internal.pageSize.getWidth();
          stage.height(window.innerWidth / ratio);
          const resizeWidthRatio = _width / stage.width();
          const resizeHeightRatio = (_height * ratio) / stage.width();
          let marginX =
            ratio < pageRatio
              ? config.canvasMargin * resizeHeightRatio +
                (_width - _height * ratio) / 2
              : config.canvasMargin * resizeWidthRatio;
          const pdfSize =
            ratio < pageRatio
              ? {
                  width: _height * ratio,
                  height: _height,
                }
              : {
                  width: _width,
                  height: _width / ratio,
                };
          if (type === EXPORT_TYPES.PDF) {
            pdf.addImage(
              stage.toDataURL({ pixelRatio: 2 }),
              'JPEG',
              marginX,
              0,
              pdfSize.width,
              pdfSize.height,
              '',
              'FAST'
            );
            pdf.save('annotation.pdf');
          } else {
            // stage to center export file
            const bgRect = stage.findOne('#backgroundRect');
            stage.x(config.canvasMargin);
            bgRect.x(-config.canvasMargin);
            // create base64
            const base64 = stage.toDataURL({
              mimeType: 'image/png',
              pixelRatio: 2,
            });
            //create blob from base64
            var arr = base64.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            var blobData = new Blob([u8arr], { type: mime });
            // create url download from blob
            var url = URL.createObjectURL(blobData);
            const a = document.createElement('a');
            a.download = 'annotation.png';
            a.href = url;
            a.click();
            // reset position
            stage.x(0);
            bgRect.x(0);
          }
        });
        resolve();
      }, 1000);
    });
  };

  resetLayer = (callback = () => {}) => {
    this.resetZoom(this.layerRef.current);
    setTimeout(callback, 1000);
  };

  // get base64 from canvas
  toImageData = (pageSize = 'a4') => {
    const stage = this.stageRef.current;
    const glossaryH = this.getGlossaryHeight();
    const width = this.imageRef.current.width();
    const height = this.imageRef.current.height() + glossaryH;
    const ratio = width / height;
    var pdf = new jsPDF('p', 'px', pageSize, true);
    stage.height(window.innerWidth / ratio);
    // let marginX =
    //   width < height
    //     ? this.state.config.canvasMargin * resizeHeightRatio +
    //       (_width - _height * ratio) / 2
    //     : this.state.config.canvasMargin * resizeWidthRatio;
    // return stage.toDataURL({ pixelRatio: 1 });
  };

  // submit edit
  onSave = () => {
    const { config, info, note } = this.state;
    this.clearSelectState();
    this.props.onSave({ config, info, note }, this.props.closeModal);
  };

  closeModal = () => {
    this.clearSelectState();
    this.props.closeModal();
  };

  clearSelectState = (callback = () => {}) => {
    this.setState(
      {
        selectedGlossaryId: null,
        selectedGroupTextId: null,
        selectedTextId: null,
        isSelectIndicator: false,
      },
      callback
    );
  };

  setTextConfig = (config, callback) => {
    this.setState(
      { textConfig: { ...this.state.textConfig, ...config } },
      () => {
        if (callback) {
          callback();
        }
      }
    );
  };

  // modify glossary icon data
  setIconInfo = (data, index) => {
    const { info } = this.state;
    let changeItem = info[index];
    changeItem.icon = { ...this.state.info[index].icon, ...data };
    info[index] = changeItem;
    this.setState({ info });
  };

  // modify annotate data
  setNoteData = (data = { indicator: {}, message: {} }, index) => {
    const { note } = this.state;
    let changeItem = note[index];
    changeItem.indicator = { ...changeItem.indicator, ...data.indicator };
    changeItem.message = { ...changeItem.message, ...data.message };
    note[index] = changeItem;
    this.setState({ note });
  };

  // trigger canvas scroll to top
  scrollToTop = () => {
    var scrollContainer = document.getElementById('image-canvas');
    scrollContainer.scrollTop = 0;
  };

  // handle scroll on canvas
  repositionStage = () => {
    var textareaDraft = document.getElementById('textareaDraft');
    if (textareaDraft) {
      textareaDraft.blur();
    }
    var scrollContainer = document.getElementById('image-canvas');
    var dx = scrollContainer.scrollLeft;
    var dy = scrollContainer.scrollTop;
    this.setState({ scrollTop: dy });
    this.stageRef.current.container().style.transform =
      'translate(' + dx + 'px, ' + dy + 'px)';
    this.stageRef.current.x(-dx);
    this.stageRef.current.y(-dy);
    this.stageRef.current.batchDraw();
  };

  // change mode
  onChangeMode = (mode) => {
    this.setState(
      {
        mode,
        selectedGlossaryId: null,
        selectedTextId: null,
        selectedGroupTextId: null,
        isSelectIndicator: false,
      },
      () => {
        this.destroyDraftRects();
        if (mode === MODES.DRAW_RECT) {
          this.stageRef.current.container().style.cursor = 'crosshair';
        } else if (mode === MODES.ADD_TEXT) {
          this.stageRef.current.container().style.cursor = 'text';
        } else {
          this.stageRef.current.container().style.cursor = 'default';
        }
      }
    );
  };

  // return focusing note
  getCurrentText = (id) => {
    return this.stageRef.current.findOne(`#${id || this.state.selectedTextId}`);
  };

  // return an element by id
  getElement = (id) => {
    return this.stageRef.current.findOne(`#${id}`);
  };

  onPaintStart = (e) => {
    const layer = this.layerRef.current;
    var pos = this.stageRef.current.getPointerPosition();
    this.setState({ lastMouseX: pos.x, lastMouseY: pos.y });
    const { mode } = this.state;
    if (mode === MODES.DRAW_RECT || mode === MODES.ADD_TEXT) {
      this.setState({ isPaint: true });
      const { textConfig, scale, scrollTop } = this.state;
      var rect = new Konva.Rect({
        id: 'draftRect',
        name: 'drawLine',
        x: (pos.x - layer.x()) / scale,
        y: (pos.y - layer.y() + scrollTop) / scale,
        width: 0,
        height: 0,
        globalCompositeOperation: 'source-over',
        stroke: textConfig.color,
        strokeWidth: textConfig.strokeWidth,
      });
      layer.add(rect);
    }
    if (mode === MODES.SELECT) {
      if (
        e.target.name() !== 'selectable' &&
        !e.target.name().includes('_anchor')
      ) {
        this.clearSelectState();
      }
    }
  };

  onPaint = (e) => {
    const layer = this.layerRef.current;
    const { scale, scrollTop } = this.state;
    if (!this.state.isPaint) {
      return;
    }
    const pos = this.stageRef.current.getPointerPosition();

    if (this.state.mode === MODES.DRAW_RECT) {
      var rects = layer.find('Rect');
      const lastRect = rects[rects.length - 1];
      lastRect.width((pos.x - layer.x()) / scale - lastRect.x());
      lastRect.height((pos.y - layer.y() + scrollTop) / scale - lastRect.y());
      layer.batchDraw();
    }
  };

  onPaintEnd = (e) => {
    // const { scale, scrollTop } = this.state;
    this.setState({ isPaint: false });
    if (this.state.mode === MODES.DRAW_RECT) {
      if (this.state.isSelectIndicator) {
        this.destroyDraftRects();
        this.setState({ isSelectIndicator: false });
      } else {
        this.onAddNotes();
      }
      this.layerRef.current.batchDraw();
    } else if (this.state.mode === MODES.ADD_TEXT) {
      if (this.state.isSelectIndicator) {
        this.destroyDraftRects();
        this.onChangeMode(MODES.SELECT);
      } else {
        const draftRect = this.layerRef.current.findOne('#draftRect');
        this.setState(
          { isSelectIndicator: true },
          () => {
            const actions = document.getElementById('actions'); // actions showed up like add note / add glossary
            if (draftRect) {
              const distanceFromMouseToActions = 50;
              actions.style.left =
                e.evt.clientX < actions.offsetWidth + distanceFromMouseToActions
                  ? e.evt.clientX + distanceFromMouseToActions + 'px'
                  : e.evt.clientX -
                    distanceFromMouseToActions -
                    actions.offsetWidth +
                    'px';
              actions.style.top = e.evt.clientY + 'px';
              actions.style.transform = 'translateY(-50%)';
            }
          },
          () => {
            this.destroyDraftRects();
          }
        );
      }
    }
  };

  // remove all redundant rectangle
  destroyDraftRects = () => {
    const draftRects = this.layerRef.current.find('#draftRect');
    draftRects.map((r) => r.destroy());
  };

  setNoteMessageProps = (p) => {
    const { note } = this.state;
    // eslint-disable-next-line array-callback-return
    note.map((n) => {
      n.message = { ...n.message, ...p };
    });
    this.setState({ note });
  };

  setNoteIndicatorProps = (p) => {
    const { note } = this.state;
    // eslint-disable-next-line array-callback-return
    note.map((n) => {
      n.indicator = { ...n.indicator, ...p };
    });
    this.setState({ note });
  };

  getRemoveIconPosition = (isTopRightIndicator, note) => {
    const scaleRatio = this.getScaleRatio();
    const currentTextNode = this.getCurrentText(`text${note.id}`);
    return isTopRightIndicator
      ? {
          x: note.indicator.x * scaleRatio + note.indicator.w - 12,
          y: note.indicator.y * scaleRatio - 12,
        }
      : {
          x: currentTextNode.x() + currentTextNode.width() - 10,
          y: currentTextNode.y() - 20,
        };
  };

  // handle on click Add note button
  onAddNotes = (hasIndicator = true) => {
    this.setState({ isSelectIndicator: false });
    const layer = this.layerRef.current;
    const scaleRatio = this.getScaleRatio();
    const { textConfig, note } = this.state;
    const draftRect = layer.findOne('#draftRect');
    const id = uuid();
    const defaultMessageWidth = 100;
    const defaultIndicatorSize = 50;
    const indicatorMargin = 60;
    var indicatorW = 0;
    var indicatorH = 0;
    if (hasIndicator) {
      indicatorW = draftRect.width() || defaultIndicatorSize;
      indicatorH = draftRect.height() || defaultIndicatorSize;
    }
    note.push({
      id,
      indicator: {
        x: draftRect.x() / scaleRatio,
        y: draftRect.y() / scaleRatio,
        w: indicatorW,
        h: indicatorH,
        color: textConfig.strokeStyle,
        thick: textConfig.strokeWidth,
      },
      message: {
        x:
          draftRect.x() > defaultMessageWidth + indicatorMargin
            ? (draftRect.x() - defaultMessageWidth - indicatorMargin) /
              scaleRatio // left of indicator
            : (draftRect.x() + indicatorMargin + draftRect.width()) /
              scaleRatio, // right of indicator
        y: draftRect.y() / scaleRatio,
        w: defaultMessageWidth,
        h: textConfig.fontSize,
        color: textConfig.color,
        thick: textConfig.strokeWidth,
        content: '',
      },
    });
    this.setState(
      {
        note,
        selectedGroupTextId: `${id}`,
        selectedTextId: `text${id}`,
      },
      () => {
        draftRect.destroy();
        layer.batchDraw();
        this.onEditText(this.getCurrentText(), id);
      }
    );
  };

  deleteNote = (_index) => {
    const { note } = this.state;
    note.splice(_index, 1);
    this.setState({ note }, this.clearSelectState);
  };

  deleteGlossary = (_index) => {
    const { info } = this.state;
    if (_index !== info?.length - 1) {
      // eslint-disable-next-line array-callback-return
      info.map((item, index) => {
        if (index > _index) {
          item.glossary.y = item.glossary.y - info[_index].glossary.height;
        }
      });
    }
    info.splice(_index, 1);
    this.setState({ info }, this.clearSelectState);
  };

  editGlossary = (item, index) => {
    const { explanation } = item.glossary;
    const seperatorIndex = explanation.indexOf(': ');
    const title = explanation.split(': ')[0];
    const description = explanation.substring(seperatorIndex + 2);
    this.setState({
      isNewGlossary: false,
      selectedGlossaryId: item.icon.id,
      newGlossary: {
        title,
        description,
      },
      glossaryDialogOpen: true,
    });
  };

  updateGlossary = () => {
    const { info, newGlossary} = this.state;
    const currentGlossaryIndex = info.findIndex(
      (g) => g.icon.id === this.state.selectedGlossaryId
    );
    const currentGlossary = info[currentGlossaryIndex].glossary;
    const explanation = `${newGlossary.title}: ${newGlossary.description}`;
    currentGlossary.explanation = explanation;
    const oldHeight = currentGlossary.height;
    const newHeight =
      this.getTextAreaBreakLine() > 1
        ? this.getTextHeightWithBreakLine()
        : this.getTextHeight(explanation, currentGlossary.width);
    currentGlossary.height = newHeight;
    info.map((item, index) => {
      if (index > currentGlossaryIndex) {
        item.glossary.y = item.glossary.y + newHeight - oldHeight;
      }
    });
    this.setState({ info, glossaryDialogOpen: false });
  };

  // handle on user click add glossary button
  onAddGlossary = () => {
    const {
      newGlossary,
      info,
      lastMouseX,
      lastMouseY,
      textConfig,
      config,
      scrollTop,
      scale,
    } = this.state;
    const scaleRatio = this.getScaleRatio();
    const draftRect = this.layerRef.current.findOne('#draftRect');
    const length = info && info.length;
    const content = `${newGlossary.title}: ${newGlossary.description}`;
    const iconX = (lastMouseX - this.layerRef.current.x()) / scaleRatio / scale;
    const iconY =
      (lastMouseY - this.layerRef.current.y() + scrollTop) / scaleRatio / scale;
    const insertTarget = info.find((item) => item.icon.y > iconY);
    const insertIndex = !insertTarget
      ? info.length - 1
      : info.findIndex((item) => item.icon.y > iconY);
    const width = length
      ? info[0].glossary.width
      : config.width - DEFAULT_CANVAS_MARGIN * 2;
    const _newGlossary = {
      icon: {
        x: iconX,
        y: iconY,
        id: info.length + 1,
        color: textConfig.glossaryColor,
      },
      glossary: {
        x: length ? info[0].glossary.x : 12, // default margin left
        y: info[insertIndex]?.glossary.y || 181, // default y
        width,
        height:
          this.getTextAreaBreakLine() > 1
            ? this.getTextHeightWithBreakLine()
            : this.getTextHeight(content, width),
        explanation: content,
      },
    };
    if (!insertTarget) {
      info.push(_newGlossary);
    } else {
      info.splice(insertIndex, 0, _newGlossary);
    }

    // eslint-disable-next-line array-callback-return
    info.map((item, index) => {
      if (index > insertIndex) {
        item.glossary.y = item.glossary.y + _newGlossary.glossary.height;
      }
    });
    this.setState(
      {
        info,
        newGlossary: {
          title: '',
          description: '',
        },
        glossaryDialogOpen: false,
      },
      () => {
        draftRect.destroy();
        this.layerRef.current.batchDraw();
      }
    );
  };

  onChangeGlossaryProps = (e) => {
    const { value } = e.target;
    this.setState({
      newGlossary: {
        ...this.state.newGlossary,
        [e.target.name]: value
          ? value.substring(0, 1).toUpperCase() + value.substring(1)
          : '',
      },
    });
  };

  getGlossaryHeight = () => {
    const { info} = this.state;
    const scaleRatio = this.getScaleRatio();
    return info && info.length && this.props.type === TYPES.PDF
      ? (info.reduce((prev, cur) => prev + cur.glossary.height, 0) +
          info[0].glossary.y) *
          scaleRatio
      : 0;
  };

  // GET position of arrow link between indicator and text note
  getArrowPoints = (indicator, text) => {
    const { scale } = this.state;
    const scaleRatio = this.getScaleRatio();
    if (text) {
      let indicatorX = indicator.x * scaleRatio;
      let indicatorY = indicator.y * scaleRatio;
      let textX = 0;
      let textY = 0;
      let centerTextX = text.x() + text.width() / scale / 2;
      if (centerTextX < indicatorX) {
        // case text on the left of indicator
        indicatorY = indicatorY + indicator.h / 2;
        textX = text.x() + text.width() / scale + TEXT_PADDING;
        textY = text.y() + text.height() / scale / 2;
      } else if (
        // case text between of indicator
        centerTextX >= indicatorX &&
        centerTextX <= indicatorX + indicator.w
      ) {
        indicatorX = indicatorX + indicator.w / 2;
        if (text.y() < indicatorY) {
          textX = text.x() + text.width() / scale / 2;
          textY = text.y() + text.height() / scale + TEXT_PADDING;
        } else {
          indicatorY = indicatorY + indicator.h;
          textX = text.x() + text.width() / scale / 2;
          textY = text.y() - TEXT_PADDING;
        }
      } else {
        // case text on the right of indicator
        indicatorX = indicatorX + indicator.w;
        indicatorY = indicatorY + indicator.h / 2;
        textX = text.x() - TEXT_PADDING;
        textY = text.y() + text.height() / scale / 2;
      }
      return [indicatorX, indicatorY, textX, textY];
    }
    return [];
  };

  onOpenExportMenu = () => {
    const exportMenu = document.getElementById('exportMenu');
    if (!exportMenu.classList.contains('show')) {
      exportMenu.classList.add('show');
    } else {
      exportMenu.classList.remove('show');
    }
  };

  onCloseExportMenu = () => {
    const exportMenu = document.getElementById('exportMenu');
    setTimeout(() => {
      exportMenu.classList.remove('show');
    }, 200);
  };

  setPageSize = (e) => {
    this.setState({ pageSize: e.target.value });
  };

  repositionBottomGlossary = (e) => {
    const scaleRatio = this.getScaleRatio();
    this.setState({
      config: {
        ...this.state.config,
        bottomSectionY: e.currentTarget.y() / scaleRatio,
        bottomSectionX: e.currentTarget.x() / scaleRatio,
      },
    });
  };

  getDicomData = () => {
    if (this.dicomViewerRef.current) {
      return this.dicomViewerRef.current?.getImageData();
    }
    return '';
  };

  render() {
    const {
      textConfig,
      mode,
      info,
      config,
      note,
      width,
      height,
      scale,
      pageSize,
      isNewGlossary,
      glossaryDialogOpen,
      newGlossary,
      selectedGlossaryId,
      selectedTextId,
      dicomData,
      isSelectIndicator,
      selectedGroupTextId,
    } = this.state;

    const scaleRatio = this.getScaleRatio();
    const glossaryIconSize = config?.circleRadius * scaleRatio;
    const scrollContainer = document.getElementById('large-container');
    const konvaContent = document.querySelector('.konvajs-content');

    return (
      <div className="image-canvas" id="image-canvas">
        {this.props.type === TYPES.XRAY && (
          <DicomViewer
            style={{
              position: 'absolute',
              top: -height,
              left: -width,
              height,
              width,
              zIndex: 1900,
            }}
            ref={this.dicomViewerRef}
            url={this.props.url}
            width={width}
            height={height}
            konvaContent={konvaContent}
          />
        )}
        <div style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.flexCenter}>
              {this.props.role === DOCTOR_ROLE && (
                <div>
                  <button
                    title="Select"
                    className={
                      mode === MODES.SELECT ? 'btn primary' : 'btn transparent'
                    }
                    onClick={() => {
                      this.onChangeMode(MODES.SELECT);
                    }}
                  >
                    <FIcon color="#fff" icon="navigation" />
                  </button>
                  <button
                    title="Note"
                    className={
                      mode === MODES.ADD_TEXT
                        ? 'btn primary'
                        : 'btn transparent'
                    }
                    onClick={() => {
                      this.onChangeMode(MODES.ADD_TEXT);
                    }}
                  >
                    <FIcon color="#fff" icon="type" />
                  </button>
                  <button
                    title="Draw"
                    className={
                      mode === MODES.DRAW_RECT
                        ? 'btn primary'
                        : 'btn transparent'
                    }
                    onClick={() => {
                      this.onChangeMode(MODES.DRAW_RECT);
                    }}
                  >
                    <FIcon color="#fff" icon="square" />
                  </button>
                </div>
              )}
              {selectedGlossaryId || mode === MODES.ADD_TEXT ? (
                <div style={{ position: 'relative', margin: '0 16px' }}>
                  <input
                    title="Glossary color"
                    className="circle"
                    style={{
                      width: 16,
                      height: 16,
                      opacity: 0,
                      position: 'relative',
                      zIndex: 2,
                    }}
                    onChange={(e) => {
                      this.setTextConfig({ glossaryColor: e.target.value });
                      if (selectedGlossaryId) {
                        this.setIconInfo(
                          { color: e.target.value },
                          info.findIndex(
                            (item) => item.icon.id === selectedGlossaryId
                          )
                        );
                      }
                    }}
                    type="color"
                    value={textConfig.glossaryColor}
                  />
                  <div
                    className="circle"
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: textConfig.glossaryColor,
                      position: 'absolute',
                      left: 0,
                      top: 5,
                      zIndex: 1,
                      border: '1px solid #fff',
                    }}
                  ></div>
                </div>
              ) : null}
              {selectedGroupTextId || mode === MODES.ADD_TEXT ? (
                <div className="d-flex align-items-center">
                  <select
                    title="Font size"
                    className="mono-select"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#fff',
                      padding: '0 16px',
                    }}
                    onChange={(e) => {
                      this.setTextConfig(
                        { fontSize: Number(e.target.value) },
                        () => {
                          const currentText = this.getCurrentText();
                          if (currentText)
                            this.onEditText(currentText, selectedGroupTextId);
                        }
                      );
                    }}
                    value={textConfig.fontSize}
                  >
                    {renderSizeOptions(config?.fontSize)}
                  </select>

                  <div style={{ position: 'relative', width: 36 }}>
                    <input
                      title="Text note color"
                      className="w-100 h-100"
                      style={styles.inputTextColor}
                      onChange={(e) => {
                        this.setTextConfig({ color: e.target.value });
                        this.setNoteMessageProps({ color: e.target.value });
                      }}
                      type="color"
                      value={textConfig.color}
                    />
                    <div
                      className="d-flex flex-column align-items-center text-color-icon"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      <span>A</span>
                      <div
                        style={{
                          width: 24,
                          height: 3,
                          backgroundColor: textConfig.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : null}
              {mode === MODES.DRAW_RECT || selectedGroupTextId ? (
                <>
                  <div
                    className="d-flex align-items-center"
                    style={{
                      position: 'relative',
                      margin: '0 16px',
                      height: 20,
                      width: 20,
                    }}
                  >
                    <input
                      title="Stroke color"
                      className="w-100 h-100"
                      style={styles.inputTextColor}
                      onChange={(e) => {
                        this.setTextConfig({ strokeStyle: e.target.value });
                        this.setNoteIndicatorProps({ color: e.target.value });
                      }}
                      type="color"
                      value={textConfig.strokeStyle}
                    />
                    <div
                      style={{
                        width: 24,
                        height: textConfig.strokeWidth,
                        backgroundColor: textConfig.strokeStyle,
                        position: 'absolute',
                        left: 0,
                        top: 8,
                        zIndex: 1,
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      ...styles.flexCenter,
                      marginRight: 16,
                    }}
                  >
                    <select
                      title="Stroke width"
                      style={styles.selectTransparent}
                      onChange={(e) => {
                        this.setTextConfig({
                          strokeWidth: Number(e.target.value),
                        });
                        this.setNoteIndicatorProps({
                          thick: Number(e.target.value),
                        });
                      }}
                      value={textConfig.strokeWidth}
                    >
                      {renderStrokeWidthOptions(
                        Array.from({ length: 10 }, (_, i) => i + 1)
                      )}
                    </select>
                  </div>
                </>
              ) : null}
              <button
                title="Zoom in"
                className={'btn transparent'}
                onClick={() => this.zoomStage(this.layerRef.current, 1.2)}
              >
                <FIcon color="#fff" icon="zoom-in" />
              </button>
              <button
                title="Zoom out"
                className={'btn transparent'}
                onClick={() => this.zoomStage(this.layerRef.current, 0.8)}
              >
                <FIcon color="#fff" icon="zoom-out" />
              </button>
              {this.props.role === DOCTOR_ROLE && (
                <div>
                  <button
                    title="Reset"
                    className={'btn transparent tx-white'}
                    onClick={() => this.props.onReset()}
                  >
                    Reset
                  </button>
                  <button
                    title="Clear all"
                    className={'btn transparent tx-white'}
                    onClick={this.onClear}
                  >
                    Clear all
                  </button>
                  <button
                    title="Decrease glossary icon size"
                    className={'btn transparent tx-white'}
                    onClick={this.onDecreaseGlossaryIconSize}
                  >
                    Glossary -
                  </button>
                  <button
                    title="Increase glossary icon size"
                    className={'btn transparent tx-white'}
                    onClick={this.onIncreaseGlossaryIconSize}
                  >
                    Glossary +
                  </button>
                  <select
                    title="Export page size"
                    defaultValue={pageSize}
                    style={{ width: 83, ...styles.button }}
                    className="mr-3 px-1 btn outline rounded tx-white"
                    onChange={this.setPageSize}
                  >
                    {Object.keys(pageSizes).map((size) => (
                      <option value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={this.closeModal}
                style={styles.button}
                type="button"
                className={'btn outline rounded tx-white'}
              >
                {this.props.role === DOCTOR_ROLE ? 'Cancel' : 'Close'}
              </button>
              <div className="dropdown d-inline mx-3">
                <button
                  onBlur={this.onCloseExportMenu}
                  onClick={this.onOpenExportMenu}
                  className="btn primary rounded"
                  type="button"
                  id="exportMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={styles.button}
                >
                  Export <ExpandDown style={styles.buttonIcon} />
                </button>
                <div
                  id="exportMenu"
                  className="dropdown-menu"
                  aria-labelledby="exportMenuLink"
                >
                  <a
                    className="dropdown-item"
                    onClick={() => this.onExport('pdf')}
                    href="#!"
                  >
                    PDF
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => this.onExport('png')}
                    href="#!"
                  >
                    PNG
                  </a>
                </div>
              </div>
              {this.props.role === DOCTOR_ROLE && (
                <button
                  className={'btn primary rounded'}
                  onClick={() => this.onSave()}
                >
                  Done
                </button>
              )}
            </div>
          </div>
          {isSelectIndicator && (
            <div
              id="actions"
              style={{
                position: 'fixed',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 12,
              }}
            >
              <button
                onClick={() => this.onAddNotes(false)}
                style={{ marginBottom: 10 }}
                id="addNote"
                className="btn primary"
              >
                <FIcon
                  style={{ marginRight: 10 }}
                  size={16}
                  icon="message-square"
                />
                Add notes
              </button>
              {this.props.type === TYPES.PDF && (
                <button
                  className="btn btn-primary rounded"
                  onClick={() => {
                    this.setState({
                      isSelectIndicator: false,
                      isNewGlossary: true,
                      glossaryDialogOpen: true,
                      newGlossary: {
                        title: '',
                        description: '',
                      },
                    });
                  }}
                  type="button"
                  id="addGlossary"
                >
                  <FIcon style={{ marginRight: 10 }} size={16} icon="info" />{' '}
                  Add glossary
                </button>
              )}
            </div>
          )}
        </div>
        <div id="large-container">
          <Stage
            ref={this.stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            id="stage"
            onMouseDown={this.onPaintStart}
            onTouchStart={this.onPaintStart}
            onMouseUp={this.onPaintEnd}
            onTouchEnd={this.onPaintEnd}
            onMouseMove={this.onPaint}
            onTouchMove={this.onPaint}
          >
            <Layer
              width={width}
              height={height}
              ref={this.layerRef}
              x={config ? config.canvasMargin : 50}
              y={CANVAS_MARGIN_TOP}
            >
              <Rect
                id="backgroundRect"
                width={scrollContainer ? scrollContainer.clientWidth : width}
                height={scrollContainer ? scrollContainer.scrollHeight : height}
                fill="#ffffff"
              />
              <KImage
                ref={this.imageRef}
                width={width}
                height={height}
                src={
                  this.props.type === TYPES.XRAY && dicomData
                    ? dicomData
                    : this.props.url
                }
              />
              <Text
                id="draftText"
                visible={false}
                text=""
                fontSize={config?.fontSize * scaleRatio}
                lineHeight={1.2}
              />
              {info &&
                this.props.type === TYPES.PDF &&
                info.map((item, index) => {
                  return (
                    <Group
                      name="selectable"
                      key={`glossary-${item.icon.id}`}
                      x={item.icon.x * scaleRatio}
                      y={
                        item.icon.y * scaleRatio -
                        config.circleRadius * 0.5 * scaleRatio
                      }
                      draggable={mode === MODES.SELECT}
                      onDragEnd={(e) => {
                        this.setIconInfo(
                          {
                            x: e.currentTarget.x() / scaleRatio,
                            y:
                              (e.currentTarget.y() +
                                config.circleRadius * 0.5 * scaleRatio) /
                              scaleRatio,
                          },
                          index
                        );
                      }}
                      onMouseDown={() => {
                        if (mode === MODES.SELECT) {
                          this.setState({
                            selectedGlossaryId: item.icon.id,
                            selectedGroupTextId: null,
                            selectedTextId: null,
                          });
                        }
                      }}
                    >
                      <Circle
                        name="selectable"
                        x={glossaryIconSize / 2} // * 1.5 to increase circleRadius because default so small
                        y={glossaryIconSize / 2}
                        width={glossaryIconSize}
                        height={glossaryIconSize}
                        fill={item.icon.color}
                        shadowEnabled={item.icon.id === selectedGlossaryId}
                        shadowBlur={10}
                        shadowColor="grey"
                      />
                      <Text
                        name="selectable"
                        fontStyle="bold"
                        width={glossaryIconSize}
                        y={(glossaryIconSize * 1) / 8} // padding y = (circle height - text height) / 2 => (glossaryIconSize - glossaryIconSize * 0.75) / 2
                        verticalAlign="middle"
                        align="center"
                        fontSize={glossaryIconSize * 0.75}
                        text={index + 1}
                        fill="#fff"
                      />
                      {item.icon.id === selectedGlossaryId && (
                        <URLImage
                          name="selectable"
                          onClick={() => this.deleteGlossary(index)}
                          x={
                            (config.circleRadius * scaleRatio) / 2 +
                            config.circleRadius * scaleRatio
                          }
                          y={
                            (config.circleRadius * scaleRatio) / 2 -
                            config.circleRadius * scaleRatio
                          }
                          src={CloseIcon}
                        />
                      )}
                    </Group>
                  );
                })}
              {note?.map((n, index) => (
                <Group
                  name="selectable"
                  onClick={() => {
                    this.setState(
                      {
                        selectedTextId: `text${n.id}`,
                        selectedGroupTextId: n.id,
                      },
                      () => {
                        // this.onEditText(
                        //   this.getCurrentText(`text${n.id}`),
                        //   n.id
                        // )
                      }
                       
                    );
                  }}
                  key={n.id}
                  id={n.id}
                >
                  <Arrow
                    visible={n.indicator.w && n.indicator.h}
                    pointerLength={4}
                    pointerWidth={4}
                    fill={n.indicator.color}
                    stroke={n.indicator.color}
                    strokeWidth={2}
                    points={this.getArrowPoints(
                      n.indicator,
                      this.getCurrentText(`text${n.id}`)
                    )}
                  />
                  <Rect
                    name="selectable"
                    visible={n.indicator.w && n.indicator.h}
                    draggable
                    x={n.indicator.x * scaleRatio}
                    y={n.indicator.y * scaleRatio}
                    width={n.indicator.w}
                    height={n.indicator.h}
                    globalCompositeOperation="source-over"
                    stroke={n.indicator.color}
                    strokeWidth={n.indicator.thick}
                    id={`indicator${n.id}`}
                    onDragEnd={(e) =>
                      this.setNoteData(
                        {
                          indicator: {
                            x: e.currentTarget.x() / scaleRatio,
                            y: e.currentTarget.y() / scaleRatio,
                          },
                        },
                        index
                      )
                    }
                  />
                  {this.getCurrentText(`text${n.id}`) &&
                    selectedTextId === `text${n.id}` && (
                      <Transformer
                        name="selectable"
                        visible={n.indicator.w && n.indicator.h}
                        onTransformEnd={(e) => {
                          const $thisIndicator = this.getElement(
                            `indicator${n.id}`
                          );
                          const width =
                            $thisIndicator.width() *
                            $thisIndicator.scaleX() *
                            scale;
                          const height =
                            $thisIndicator.height() *
                            $thisIndicator.scaleY() *
                            scale;
                          const inX = $thisIndicator.x() / scaleRatio;
                          const inY = $thisIndicator.y() / scaleRatio;
                          if (
                            width !== n.indicator.w &&
                            height !== n.indicator.h
                          ) {
                            $thisIndicator.setAttrs({
                              width,
                              height,
                              x: inX,
                              y: inY,
                              scaleY: 1,
                              scaleX: 1,
                            });

                            this.setNoteData(
                              {
                                indicator: {
                                  w: width,
                                  h: height,
                                  x: inX,
                                  y: inY,
                                },
                              },
                              index
                            );
                          }
                        }}
                        keepRatio={false}
                        rotateEnabled={false}
                        anchorStroke={n.indicator.color}
                        anchorFill={n.indicator.color}
                        borderStroke={n.indicator.color}
                        borderStrokeWidth={0}
                        node={this.getElement(`indicator${n.id}`)}
                        enabledAnchors={[
                          'top-left',
                          'bottom-left',
                          'bottom-right',
                        ]}
                      />
                    )}
                  <Text
                    name="selectable"
                    fontStyle="bold"
                    draggable
                    onClick={() => {
                      this.setState(
                        {
                          selectedTextId: `text${n.id}`,
                          selectedGroupTextId: n.id,
                        },
                        () => {
                          this.onEditText(
                            this.getCurrentText(`text${n.id}`),
                            n.id
                          );
                        }
                      );
                    }}
                    id={`text${n.id}`}
                    width={n.message.w * scale}
                    height={n.message.h * scale}
                    fill={n.message.color}
                    x={n.message.x * scaleRatio}
                    y={n.message.y * scaleRatio}
                    text={n.message.content}
                    fontSize={textConfig.fontSize * scale}
                    onDragEnd={(e) => {
                      this.setNoteData(
                        {
                          message: {
                            x: e.target.x() / scaleRatio,
                            y: e.target.y() / scaleRatio,
                          },
                        },
                        index
                      );
                    }}
                  />
                  {this.getCurrentText(`text${n.id}`) &&
                    selectedTextId === `text${n.id}` && (
                      <>
                        <Transformer
                          name="selectable"
                          onTransform={(e) => {
                            const $thisText = this.getCurrentText(
                              `text${n.id}`
                            );
                            const absScale = $thisText.getAbsoluteScale();
                            const width =
                              $thisText.width() * $thisText.scaleX() * scale;
                            const height =
                              $thisText.height() * $thisText.scaleY() * scale;
                            $thisText.setAttrs({
                              width,
                              height,
                              scaleY: $thisText.scaleY() / absScale.y,
                              scaleX: $thisText.scaleX() / absScale.x,
                            });
                            this.setNoteData(
                              {
                                message: {
                                  w: width,
                                  h: height,
                                },
                              },
                              index
                            );
                          }}
                          padding={TEXT_PADDING / scale}
                          keepRatio={false}
                          rotateEnabled={false}
                          anchorStroke={n.indicator.color}
                          anchorFill={n.indicator.color}
                          borderStroke={n.indicator.color}
                          borderStrokeWidth={2}
                          node={this.getCurrentText(`text${n.id}`)}
                          enabledAnchors={[
                            'top-left',
                            'bottom-left',
                            'top-right',
                            'bottom-right',
                          ]}
                        />
                        <URLImage
                          name="selectable"
                          onClick={() => this.deleteNote(index)}
                          x={
                            this.getRemoveIconPosition(
                              n.indicator.w && n.indicator.h,
                              n
                            ).x
                          }
                          y={
                            this.getRemoveIconPosition(
                              n.indicator.w && n.indicator.h,
                              n
                            ).y
                          }
                          src={CloseIcon}
                        />
                      </>
                    )}
                </Group>
              ))}
              {this.props.type === TYPES.PDF && (
                <Group
                  y={
                    config && config.bottomSectionY
                      ? config.bottomSectionY * scaleRatio
                      : height
                  }
                  x={
                    config && config.bottomSectionX
                      ? config.bottomSectionX * scaleRatio
                      : 0
                  }
                  ref={this.glossaryRef}
                  draggable
                  onDragEnd={this.repositionBottomGlossary}
                >
                  {info && (
                    <Text
                      y={
                        info && info.length
                          ? (info[0].glossary.y -
                              config.bottomCircleRadius * 2) *
                            scaleRatio
                          : 0
                      } // This element always top of glossary and spacing = 2 * circle size
                      fontStyle="bold"
                      text="NOTES:"
                      fontSize={config?.fontSize * scaleRatio}
                    />
                  )}
                  <Group>
                    {info &&
                      info.map((item, index) => {
                        return (
                          <Group
                            key={`glossary-${item.icon.id}`}
                            onClick={() => this.editGlossary(item, index)}
                          >
                            <TextCircle
                              obj={item}
                              scaleRatio={scaleRatio}
                              index={index}
                              circleSize={config.bottomCircleRadius}
                              textSize={config.bottomTextFontSize}
                              textLineHeight={item.glossary.height}
                            />
                            <Text
                              key={`info-${item.icon.id}`}
                              x={config.bottomCircleRadius * 1.5 * scaleRatio} // margin left = 1.5 size of circle} // x + circle size + a space equal circle size
                              y={item.glossary.y * scaleRatio}
                              fontSize={config.fontSize * scaleRatio}
                              width={item.glossary.width * scaleRatio}
                              text={`${item.glossary.explanation && item.glossary.explanation.length > 0 ? item.glossary.explanation : 'No Note'}`}
                            />
                          </Group>
                        );
                      })}
                  </Group>
                </Group>
              )}

            </Layer>
          </Stage>
        </div>
        <Dialog
          style={{ zIndex: 1701 }}
          fullScreen={true}
          fullWidth={true}
          maxWidth="xl"
          title="Glossary"
          actions={[
            <FlatButton
              label="Save"
              primary={true}
              onClick={isNewGlossary ? this.onAddGlossary : this.updateGlossary}
            />,
          ]}
          open={glossaryDialogOpen}
          onRequestClose={(e) => this.setState({ glossaryDialogOpen: false })}
        >
          <div className="form-group text-left">
            <label htmlFor="title">Title:</label>
            <input
              onChange={this.onChangeGlossaryProps}
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={newGlossary.title}
            />
          </div>
          <div className="form-group text-left">
            <label htmlFor="desc">Description:</label>
            <textarea
              onChange={this.onChangeGlossaryProps}
              type="text"
              className="form-control"
              name="description"
              id="desc"
              value={newGlossary.description}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Canvas;
