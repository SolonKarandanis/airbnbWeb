import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import {withDevtools} from "@angular-architects/ngrx-toolkit"
import {initialTenantState,TenantState } from "./tenant.state"
import { computed, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { ErrorResponse } from "@models/error.model";
import { TenantRepository } from "../repository/tenant.repository";
import { BookingRepository } from "../repository/booking.repository";

export const TenantStore = signalStore(
    { providedIn: 'root' },
    withDevtools('tenant'),
    withState<TenantState>(initialTenantState),
    withComputed(({

    })=>({

    })),
    withMethods((
        state,
        tenantRepo = inject(TenantRepository),
        bookingRepo = inject(BookingRepository),
    )=>({

    })),
);