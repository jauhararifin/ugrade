import React, { SFC } from "react"
import { H5, FormGroup, ControlGroup, HTMLSelect, Classes, FileInput, Button, Intent } from "@blueprintjs/core"

export const ContestSubmitForm: SFC = () => (
    <form>
        <H5>Submit Solution</H5>
        <FormGroup>
            <ControlGroup fill>
            <HTMLSelect className={Classes.FIXED} options={["C", "C++", "Java"]}
            />
            <FileInput placeholder="Source Code" />
            </ControlGroup>
        </FormGroup>
        <FormGroup>
            <HTMLSelect fill options={["Memotong Kue", "Hashing", "Kotak Coklat"]}
            />
        </FormGroup>
        <p>
            Be careful: there is 50 points penalty for submission which fails
            the pretests or resubmission (except failure on the first test,
            denial of judgement or similar verdicts).
        </p>
        <Button intent={Intent.PRIMARY} fill>Submit</Button>
    </form>
)

export default ContestSubmitForm