---
title: REST API Reference
description: Reference document for API endpoints on the Insert Webservice
category: Documentation
tags: [Documentation, REST API, Reference, REST API Reference, API Reference]
authors:
    - Captian-obvious (aka Superduperdev2)
---
# Prerequisits

Understanding this document requires some prior knowlegde with what a REST API is and how to<br/>
interact with one. It also assumes a basic understanding of data types:
- `int`: Integer<br/>
- `float`: Float32/Float64 (decimal)<br/>
- *etc*

## Legend
<span style="color: #ff0000">*</span>Required<br/>
<code style="color: #ff0000">AUTH</code> - Authorization required<br/>
<code style="color: #ff0000">BEARER</code> - Authorization via `Bearer` token required<br/>

## Data Structures
This Document mentions some data structures that are not the same as other REST APIs, Here is a<br/>
list:
### JSON Instance Tree
[**JSON**](https://www.rfc-editor.org/rfc/rfc8259) representation of an [**RBXM**](https://dom.rojo.space/binary.html). The below is typical structure and does not reflect any<br/>
real asset, real assets have actual Roblox properties such as "Material" and "CFrame"<br/>
```json
{
    "metadata":{
        "ExplicitAutoJoints":true
    },
    "class_ref":[
        {
            "Name":"SomeClass",
            "refs":[0],
            "sizeof":1
        },
        {
            "Name":"SomeOtherClass",
            "refs":[1],
            "sizeof":1
        }
    ],
    "instance_count":2,
    "class_count":2,
    "tree":[
        {
            "class_name":"SomeClass",
            "ref":0,
            "attributes":{
                "SomeAttribute":{
                    "type":"string",
                    "value":"type specific, this example is a string that isn't encoded in base64",
                    "enc":false
                }
            },
            "properties":{
                "SomeProperty":{
                    "type":"string",
                    "value":"type specific, once again this is a string that isnt encoded",
                    "enc":false
                },
                "SomeOtherProperty":{
                    "type":"rbxf32",
                    "value":0.0
                }
            },
            "children":[
                {
                    "class_name":"SomeOtherClass",
                    "ref":1,
                    "attributes":{},
                    "properties":{
                        "AnotherProperty":{
                            "type":"rbxf32",
                            "value":0.0
                        }
                    },
                    "children":[],
                    "class_id":1
                }
            ],
            "class_id":0
        }
    ]
}
```
### FileMesh
In house mesh format of Roblox, its file extension is listed with its conversion<br/>
and its listed here again: `.mesh`<br/>

The FileMesh format is a sort of mix of text and binary. Its file header is always one of these 10<br/>
- `version 1.00\n`
- `version 1.01\n`
- `version 2.00\n`
- `version 3.00\n`
- `version 3.01\n`
- `version 4.00\n`
- `version 4.01\n`
- `version 5.00\n`
- `version 6.00\n`
- `version 7.00\n`

Every version beyond `1.01` is binary. These have conventions such as FACs data and skinning.<br/>
`version 6.00\n` and beyond use a chunks format, while previous versions just list each part of the<br/>
mesh.



# Fetch Endpoints

## `GET /api/v3/asset/<assetId:int>`
Fetches an asset from Roblox's Asset Storage and parses formats that are not standard into standard formats.<br/>
Supports all `AssetType`s that are [**RBXM**](https://dom.rojo.space/binary.html) (`Model`,`AvatarAsset`,etc) & supports `Image`s, `Mesh`es,<br/>
and `Audio`<br/>
### Conversions Currently Supported:
- [**RBXM**](https://dom.rojo.space/binary.html) ⇒ [**JSON Instance Tree**](#json-instance-tree)
- [**FileMesh (`.mesh`)**](#filemesh) ⇒ Wavefront `.obj` file

### Parameters
- `assetId`<span style="color: #ff0000">*</span> (url): ID of the asset you want to fetch.
- `placeId`<span style="color: #ff0000">*</span> (query): ID of the place you are loading from, usually this is just `game.PlaceId` from the Module
- `version` (query): Version number (defaults to latest version)
- `type` (query): Asset Type (defaults to `Model`)
- `isSolidModel` <span style="color: #ff0000">DEPRECATED</span> (query): Whether or not the asset is a `SolidModel`,<br/>
This is deprecated in favor of `type=SolidModel` as it functions identically.<br/>

## `GET /api/v2/asset/<assetId:int>` (LEGACY)
Fetches an asset (in [**RBXM**](https://dom.rojo.space/binary.html)) from Roblox's Asset Storage and returns the [**JSON Instance Tree**](#json-instance-tree), only `Model`s are supported<br/>
### Parameters
- `assetId`<span style="color: #ff0000">*</span> (url): ID of the asset you want to fetch.
- `placeId`<span style="color: #ff0000">*</span> (query): ID of the place you are loading from, usually this is just `game.PlaceId` from the Module
- `version` (query): Version number (defaults to latest version)

## `GET /api/v1/asset/<assetId:int>` (LEGACY, Upgraded)
Fetches an asset from Roblox's Asset Storage and directly returns its data, previously<br/>
only `Model`s were supported, but changes in the backend allowed support for other `AssetType`s<br/>
### Parameters
- `assetId`<span style="color: #ff0000">*</span> (url): ID of the asset you want to fetch.
- `placeId`<span style="color: #ff0000">*</span> (query): ID of the place you are loading from, usually this is just `game.PlaceId` from the Module
- `version` (query): Version number (defaults to latest version)
- `type` (query): Asset Type (defaults to `Model`)

# Additional Endpoints

## `POST /api/v3/parse`
Parse an [**RBXM**](https://dom.rojo.space/binary.html) Stream into a [**JSON Instance Tree**](#json-instance-tree);<br/>
Used internally by the module to parse `UnionOperation`/`IntersectOperation` `ChildData` into its<br/> [**JSON Instance Tree**](#json-instance-tree)<br/>
### Parameters
- Request `body`<span style="color: #ff0000">*</span>: Base64 encoded [**RBXM**](https://dom.rojo.space/binary.html) stream to parse


## `POST /api/restart`
Restarts the webservice and any related processes. DEVELOPER CONTROLLED<br/>
<code style="color: #ff0000">AUTH</code> <code style="color: #ff0000">BEARER</code><br/>

### Parameters
Request `body` consists of a JSON Structure with the following fields.
- `body.Reason`<span style="color: #ff0000">*</span>: Reason for restarting.
- `body.JobId`<span style="color: #ff0000">*</span>: Server triggering the restart, usually this is just going to be `game.JobId`
- `body.RestartTime`: Time of the restart, will default to the moment the request arrives.

Other Parameters are:
- `timeout` (query): Event Timeout, optional, defaults to `5`