
class DeliveryDto {

    constructor({_id, code, creation_date, state, pickup, dropoff, zone_id, bot_code}) {
        this.id = _id;        
        this.code = code;        
        this.creation_date = creation_date;
        this.state = state;
        this.pickup = pickup;
        this.dropoff = dropoff;
        this.zone_id = zone_id;
        this.bot_code = bot_code;
    }
}

module.exports = DeliveryDto;