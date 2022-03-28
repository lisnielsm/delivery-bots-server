class BotDto {

    constructor({ _id, code, status, location, zone_id }) {
        this.id = _id;
        this.code = code;
        this.status = status;
        this.location = location;
        this.zone_id = zone_id;
    }
}

module.exports = BotDto;