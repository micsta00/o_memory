import React, { useState } from "react";

export default function Tile(props) {
    return (
        <div
            onClick={
                !props.havePare && props.isClickable
                    ? () => props.counter(props.id, props.el)
                    : undefined
            }
            style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 70,
                height: 70,
                border: "1px solid #FFF",
                backgroundColor: props.havePare ? "green" : "blue"
            }}
        >
            {props.isFlipped || props.havePare ? props.el : ""}
        </div>
    );
}
