# STAC Dimensions Extension Spec

This document explains the fields of the STAC Dimensions Extension (dim) to a STAC `Dataset`. Data can have different dimensions (= axes), e.g. in meteorology. The properties of these dimensions can be defined with this extension.

## Dimensions Extension Description

This is the field that extends the `Dataset` object:

| Element          | Type                 | Name                      | Description                                                  |
| ---------------- | -------------------- | ------------------------- | ------------------------------------------------------------ |
| dim:dimensions          | [Dimension Object] | Dimensions               | Dimensions of the data. If the dimensions have an order, the order SHOULD be reflected in the order of the array. |

### Dimension Object

| Element | Type             | Name                | Description                                                  |
| ------- | ---------------- | ------------------- | ------------------------------------------------------------ |
| label   | string           | Label (required)    | Human-readable label for the dimension.                      |
| unit    | string           | Unit of Measurement | Unit of measurement, preferably SI. ToDo: Any standard to express this, e.g. [UDUNITS](https://www.unidata.ucar.edu/software/udunits/) or this [dict](https://www.unc.edu/~rowlett/units/)? |
| extent  | [number\|string] | Data Extent         | Specifies the extent of the data, i.e. the lower bound as the first element and the upper bound as the second element of the array. |
