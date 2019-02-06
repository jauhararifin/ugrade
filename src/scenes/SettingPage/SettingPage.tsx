import React from "react"
import { FormGroup, InputGroup, Button, Divider, Label } from "@blueprintjs/core"
import { Link } from "react-router-dom"

import "./styles.css"

import BottomLink from "../../components/BottomLink"

const SettingPage = () => (
  <div className="setting-page">
    <div className="setting-page-panel">
      <div>
        <h2>Settings</h2>
      </div>
      <div className="setting-page-content">
        <h3>Proxy Setting</h3>
        <Divider />
        <FormGroup label="Proxy Host">
          <Label>
            <InputGroup placeholder="Host" />
          </Label>
          <Label>
            <InputGroup placeholder="Port" />
          </Label>
        </FormGroup>
        <FormGroup label="Proxy Authentication">
          <Label>
            <InputGroup placeholder="Username" />
          </Label>
          <Label>
            <InputGroup placeholder="Password" />
          </Label>
        </FormGroup>
        <div className="right">
          <Button>Save Proxy</Button>
        </div>
      </div>
    </div>
    <BottomLink>
        <Link to="/signup">Sign Up</Link>
        <Link to="/signin">Sign In</Link>
    </BottomLink>
  </div>
)

export default SettingPage
