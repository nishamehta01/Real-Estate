import { createSlice } from "@reduxjs/toolkit"
import { updateUser } from "../../../backend/controller/user.controller"

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },

        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSucces: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
    },
})

export const {
    signInFailure,
     signInStart,
      signInSuccess, 
      updateUserFailure, 
      updateUserStart, 
      updateUserSucces,
      deleteUserFailure,
      deleteUserStart,
      deleteUserSuccess,
    } = userSlice.actions

export default userSlice.reducer