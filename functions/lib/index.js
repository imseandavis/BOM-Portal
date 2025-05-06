"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserRole = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.setUserRole = functions.https.onCall(async (request) => {
    var _a;
    const { uid, role } = request.data;
    // Ensure the caller is an admin
    if (!((_a = request.auth) === null || _a === void 0 ? void 0 : _a.token.admin)) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can set user roles');
    }
    if (!uid || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'UID and role are required');
    }
    try {
        // Set custom claims
        await admin.auth().setCustomUserClaims(uid, { role });
        // Force token refresh
        await admin.auth().revokeRefreshTokens(uid);
        return { success: true };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'Error setting user role');
    }
});
//# sourceMappingURL=index.js.map