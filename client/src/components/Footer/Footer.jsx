import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
          <nav className="pull-left">
            <ul>
              <li>
                <a> V1.3.57</a>
              </li>
            </ul>
          </nav>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
            <a href="http://www.devpost.com/jonmorazav">App`tizer team</a>
          </p>
      </footer>
    );
  }
}

export default Footer;
