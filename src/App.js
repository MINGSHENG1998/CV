import React, { Component } from "react";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Resume from "./Components/Resume";
import Contact from "./Components/Contact";
import Portfolio from "./Components/Portfolio";
import firebaseChunk from "./firebase";
import { collection, getDocs } from "firebase/firestore";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: "bar",
      resumeData: {},
    };
  }

  getResumeData = async () => {
    const fireDb = {};
    const mainDb = await getDocs(collection(firebaseChunk.db, "main"));
    const mainDbObj = mainDb.docs.map((d) => ({ id: d.id, ...d.data() }));
    const resumeDb = await getDocs(collection(firebaseChunk.db, "resume"));
    const resumeDbObj = resumeDb.docs.map((d) => ({ id: d.id, ...d.data() }));
    fireDb.main = mainDbObj[0];
    fireDb.resume = resumeDbObj[0];
    this.setState({ resumeData: fireDb });
  };

  componentDidMount() {
    this.getResumeData();
  }

  render() {
    return (
      <div className="App">
        <Header data={this.state.resumeData.main} />
        <About data={this.state.resumeData.main} />
        <Resume data={this.state.resumeData.resume} />
        {/* <Portfolio data={this.state.resumeData.portfolio}/> */}
        {/* <Contact data={this.state.resumeData.main}/> */}
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
