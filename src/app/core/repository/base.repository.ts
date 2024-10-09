import { environment } from "src/environments/environment";

export class BaseRepository{
    private readonly _airBnbEndpoint = `http://${environment.airbnbDomain}`;

    public get airBnbEndpoint(): string{
        return this._airBnbEndpoint;
    }
}