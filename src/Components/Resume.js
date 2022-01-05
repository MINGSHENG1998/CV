import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
class Resume extends Component {
  render() {
    if (this.props.data) {
      var techMessage = this.props.data.technologies.message;
      var work = this.props.data.work.map(function (work) {
        return (
          <div key={work.company}>
            <h3>{work.company}</h3>
            <p className="info">
              {work.title}
              <span>&bull;</span> <em className="date">{work.years}</em>
            </p>
            <p>{work.description}</p>
          </div>
        );
      });
      var education = this.props.data.education.map(function (education) {
        return (
          <div key={education.school}>
            <h3>{education.school}</h3>
            <p className="info">
              {education.degree} <span>&bull;</span>
              <em className="date">{education.graduated}</em>
            </p>
            <p>{education.description}</p>
          </div>
        );
      });
      var frontend = this.props.data.technologies.frontend.map(function (
        frontend
      ) {
        return (
          <li style={{ listStyle: "none" }} className="technologies-items">
            <img src={frontend.IconUrl} style={{height: "50px"}} />
            <p>{frontend.name}</p>
          </li>
        );
      });
      var backend = this.props.data.technologies.backend.map(function (
        backend
      ) {
        return (
          <li style={{ listStyle: "none" }} className="technologies-items">
            <img src={backend.IconUrl} style={{height: "50px", maxWidth: "100px"}} />
            <p>{backend.name}</p>
          </li>
        );
      });
      var publications = this.props.data.publications.map(function (
        publications
      ) {
        return (
          <div>
            <p className="info publications">{publications.title}</p>
            <a
              className="publications_url"
              href={publications.publicationUrl}
              target="_blank"
            >
              Read full Publication here
            </a>
            <a href={publications.publicationUrl} target="_blank">
              <Document
                file={publications.publicationLocal}
                onLoadError={console.error}
              >
                <Page pageNumber={1} />
              </Document>
            </a>
          </div>
        );
      });
    }

    return (
      <section id="resume">
        <div className="row work">
          <div className="three columns header-col">
            <h1>
              <span>Experience</span>
            </h1>
          </div>
          <div className="nine columns main-col">{work}</div>
        </div>

        <div className="row education">
          <div className="three columns header-col">
            <h1>
              <span>Education</span>
            </h1>
          </div>

          <div className="nine columns main-col">
            <div className="row item">
              <div className="twelve columns">{education}</div>
            </div>
          </div>
        </div>

        <div className="row technology">
          <div className="three columns header-col">
            <h1>
              <span>Technologies</span>
            </h1>
          </div>
          <div className="nine columns main-col">
            <h3>{techMessage}</h3>
            <table className="technologies-list">
              <tr>
                <td>
                  <h4>Frontend</h4>
                </td>
                <td>
                  <h4>Backend</h4>
                </td>
              </tr>
              <tr>
                <td>
                  <ul>{frontend}</ul>
                </td>
                <td>
                  <ul>{backend}</ul>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div className="row publication">
          <div className="three columns header-col">
            <h1>
              <span>Publications</span>
            </h1>
          </div>
          <div className="nine columns main-col">{publications}</div>
        </div>

        {/* <div className="row skill">

          <div className="three columns header-col">
            <h1><span>Skills</span></h1>
          </div>

          <div className="nine columns main-col">

            <p>{skillmessage}
            </p>

            <div className="bars">
              <ul className="skills">
                {skills}
              </ul>
            </div>
          </div>
        </div> */}
      </section>
    );
  }
}

export default Resume;
