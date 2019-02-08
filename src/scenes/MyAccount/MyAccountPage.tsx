import React, { SFC } from "react"
import { Link } from "react-router-dom"
import { FormGroup, Label, InputGroup } from "@blueprintjs/core"

import "./styles.css"

import BottomLink from "../../components/BottomLink"
import MyAccountPassword from "./MyAccountPassword"
import MyAccountProfile from "./MyAccountProfile"
import { User } from "../../stores/Auth"

export interface MyAccountPageProps {
  loading: boolean
}

const MyAccountPageFormSkeleton: SFC = () => (
  <React.Fragment>
    {[0,0,0].map(() => (<React.Fragment>
      <h3 className="bp3-skeleton">Account Profile</h3>
      <FormGroup className="bp3-skeleton" label="Fake">
        <Label><InputGroup placeholder="Name"/></Label>
        <Label><InputGroup placeholder="Name"/></Label>
        <Label><InputGroup placeholder="Name"/></Label>
      </FormGroup>
    </React.Fragment>))}
  </React.Fragment>
)

export const MyAccountPage: SFC<MyAccountPageProps> = ({ loading }) => (
  <div className="plain-page">
    <div className="my-account-page-panel">
      <div>
        <h2>Account Setting</h2>
      </div>

      { loading && <MyAccountPageFormSkeleton /> }

      { !loading && <MyAccountProfile /> }
      { !loading && <MyAccountPassword /> }
    
    </div>
    <BottomLink>
      <Link to="/">Home</Link>
    </BottomLink>
  </div>
)

export default MyAccountPage
