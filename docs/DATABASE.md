# Nautilus Transfers Database

## Transfers

| Field | Type |
|--------|------|
| id | string |
| transferNumber | string |
| clientName | string |
| phone | string |
| email | string |
| date | date |
| time | time |
| pickup | string |
| destination | string |
| flight | string |
| adults | number |
| children | number |
| babySeats | number |
| boosterSeats | number |
| driverId | string |
| vehicleId | string |
| partnerId | string |
| price | number |
| status | string |
| notes | text |

---

## Drivers

| Field | Type |
|--------|------|
| id | string |
| name | string |
| phone | string |
| email | string |
| active | boolean |

---

## Vehicles

| Field | Type |
|--------|------|
| id | string |
| name | string |
| registration | string |
| seats | number |
| active | boolean |

---

## Partners

| Field | Type |
|--------|------|
| id | string |
| company | string |
| contact | string |
| phone | string |
| email | string |