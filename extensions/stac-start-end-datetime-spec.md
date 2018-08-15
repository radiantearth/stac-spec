# STAC Start End Time Extension Spec

An extension to provide start and end datetime stamps in a consistent way.

## Collection Extension Description
 | element             | type info                 | name                    | description                                                                                 | 
|----------------------|---------------------------|-------------------------|---------------------------------------------------------------------------------------------| 
| set:start_datetime | [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6) | start datetime | The first or start time for the item
| set:end_datetime | [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339#section-5.6) | end datetime | start datetime | The last or end time for the item

All `Items` that use the start end time extension to designate additional fields must include both the `set:start_date:time` field and the `set:end_datetime`,
which enables a user to search STAC records by the provided times. 
