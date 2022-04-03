class BotDto {

    constructor({ _id, code, status, location, zone_id, delivery_code }) {
        this.id = _id;
        this.code = code;
        this.status = status;
        this.location = location;
        this.zone_id = zone_id;
        this.delivery_code = delivery_code;
    }
}

module.exports = BotDto;