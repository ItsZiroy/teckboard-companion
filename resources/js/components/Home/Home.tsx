import {Typography} from "@material-ui/core";
import * as React from "react";
import MdnsTeckboards from "../MdnsTeckboards";

export default function Home() {
    return (
        <>
            <Typography variant="h2" color="primary">
                TECKscreens nearby:
            </Typography>
            <MdnsTeckboards/>
        </>
    );
}
