class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cProb: '',dProb: ''};
  }

  videoRef = React.createRef();

  //model.classify if using local model
  detectFromVideoFrame = (model, video) => {
    model.predict(video).then(predictions => {
      console.log(predictions);
      this.showDetections(predictions);

      requestAnimationFrame(() => {
        this.detectFromVideoFrame(model, video);
      });
    }, (error) => {
      console.error(error)
    });
  };


  showDetections = predictions => {
    predictions.forEach(prediction => {

      if (prediction.label == "b'dog'") {
        this.setState({dProb: prediction.prob.toFixed(3)});
      }else if (prediction.label == "b'coyote'") {
        this.setState({cProb: prediction.prob.toFixed(3)});
      }

      if (prediction.className == "dog") {
        this.setState({dProb: prediction.probability.toFixed(3)});
      }else if (prediction.className == "coyote") {
        this.setState({cProb: prediction.probability.toFixed(3)});
      }


    });
  }

  componentDidMount() {
      // define a Promise that'll be used to load the model
      //const loadlModelPromise = tf.automl.loadImageClassification('dog_coyote_model2/machinelearning-257217-vcm/model-export/icn/tf_js-coyotes_n_dogs_v2-2019-10-28T03:11:27.227Z/model.json');

      const URL = "https://teachablemachine.withgoogle.com/models/SvmWh-28/";
      
      //const URL = "./dog_coyote_model3/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      
      const loadlModelPromise = tmImage.load(modelURL, metadataURL);
      
      
      //const loadlModelPromise = cocoSsd.load();
      
      // resolve all the Promises
      Promise.all([loadlModelPromise])
        .then(values => {
          this.detectFromVideoFrame(values[0], this.videoRef.current);
        })
        .catch(error => {
          console.error(error);
        });
  }

  // here we are returning the video frame and canvas to draw,
  //http://192.168.1.12:8080/?action=stream
  render() {
    return (
      <div> 
        Coyote: <input type="text" value={this.state.cProb} /><br />
        Dog: <input type="text" value={this.state.dProb} />
        <br />
        <img
          style={this.styles}
          ref={this.videoRef}
          crossOrigin="anonymous" 
          src = "http://192.168.1.12:8080/?action=stream"
        />
      </div>
    );
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(App), domContainer);