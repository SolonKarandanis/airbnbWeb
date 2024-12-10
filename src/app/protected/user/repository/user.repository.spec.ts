import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { UserRepository } from "./user.repository";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { SearchResult } from "@models/search.model";
import { mockArrayBuffer, mockCreateUserRequest, mockUpdateUserRequest, mockUser, mockUserSearchRequest } from "src/app/testing/mockData";
import { UserModel } from "@models/user.model";

describe('UserRepository', () =>{
    let repository: UserRepository;
    let httpTesting: HttpTestingController;
    let searchResult: SearchResult<any>;

    const apiUrl: string = 'users';

    beforeEach(() =>{
        TestBed.configureTestingModule({
            providers:[
                provideHttpClient(), 
                provideHttpClientTesting()
            ]
        });

        repository = TestBed.inject(UserRepository);
        httpTesting = TestBed.inject(HttpTestingController);

        searchResult = {
            countRows: 1,
            list: [],
        };
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });

    it('should search users', () =>{
        repository.searchUsers(mockUserSearchRequest).subscribe({
            next: (results: SearchResult<UserModel>) => {
                expect(results).toBeTruthy();
                expect(results).toEqual(searchResult);
                expect(Array.isArray(results.list)).toBeTrue();
                expect(results.list[0]).toEqual(mockUser);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/search`, 'Request to search users');

        expect(req.request.method).toBe('POST');
        expect(req.request.params.keys().length).toBe(0);
        expect(req.request.body).toEqual(mockUserSearchRequest);

        searchResult.list = [mockUser];

        req.flush(searchResult);
    });

    it('should export users to csv', () => {
        repository.exportUsersToCsv(mockUserSearchRequest).subscribe();

        const req = httpTesting.expectOne(`${apiUrl}/export/csv`, 'Request to export users to csv');

        expect(req.request.method).toBe('POST');
        expect(req.request.params.keys().length).toBe(0);
        expect(req.request.body).toEqual(mockUserSearchRequest);

        req.flush(mockArrayBuffer);
    });

    it('should get a user', () => {
        const userId: string = '1';
        repository.getUserById(userId).subscribe({
            next: (result: UserModel) => {
                expect(result).toBeTruthy();
                expect(result).toEqual(mockUser);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/${userId}`, 'Request to get user details');

        expect(req.request.method).toBe('GET');
        expect(req.request.params.keys().length).toBe(0);

        req.flush(mockUser);
    });

    it('should register a user', () =>{
        repository.registerUser(mockCreateUserRequest).subscribe({
            next: (result: UserModel) => {
                expect(result).toBeTruthy();
                expect(result).toEqual(mockUser);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}`, 'Request to register a user');

        expect(req.request.method).toBe('POST');
        expect(req.request.params.keys().length).toBe(0);

        req.flush(mockUser);
    });

    it('should update a user', () =>{
        const userId: string = '1';
        repository.updateUser(userId,mockUpdateUserRequest).subscribe({
            next: (result: UserModel) => {
                expect(result).toBeTruthy();
                expect(result).toEqual(mockUser);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/${userId}`, 'Request to update a user');

        expect(req.request.method).toBe('PUT');
        expect(req.request.params.keys().length).toBe(0);

        req.flush(mockUser);
    });

    it('should delete a user', () =>{
        const userId: string = '1';
        repository.deleteUser(userId).subscribe({
            next: () => {
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/${userId}`, 'Request to delete catalogue');

        expect(req.request.method).toBe('DELETE');
        expect(req.request.params.keys().length).toBe(0);
        expect(req.request.body).toBeNull();

        req.flush(null);
    });

    it('should activate a user', () =>{
        const userId: string = '1';
        repository.activateUser(userId).subscribe({
            next: (result: UserModel) => {
                expect(result).toBeTruthy();
                expect(result).toEqual(mockUser);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/${userId}/activate`, 'Request to activate a user');

        expect(req.request.method).toBe('PUT');
        expect(req.request.params.keys().length).toBe(0);
        expect(req.request.body).toBeNull();

        req.flush(mockUser);
    });

    it('should deactivate a user', () =>{
        const userId: string = '1';
        repository.deactivateUser(userId).subscribe({
            next: (result: UserModel) => {
                expect(result).toBeTruthy();
                expect(result).toEqual(mockUser);
            },
        });

        const req = httpTesting.expectOne(`${apiUrl}/${userId}/deactivate`, 'Request to deactivate a user');

        expect(req.request.method).toBe('PUT');
        expect(req.request.params.keys().length).toBe(0);
        expect(req.request.body).toBeNull();

        req.flush(mockUser);
    });
});