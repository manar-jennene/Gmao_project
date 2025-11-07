<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Role;
use Illuminate\Validation\ValidationException;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */public function register(Request $request)
{
    $validated = $request->validate([
        'nom' => 'required|string|max:255',
        'prenom' => 'required|string|max:255',
        'matricule' => 'required|string|unique:users,matricule',
        'mobile' => 'required|string',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
        'role' => 'required|string|exists:roles,role' // Vérifie que le rôle existe
    ]);

    // Récupérer le rôle correspondant
    $role = Role::where('role', $validated['role'])->first();

    // Création de l'utilisateur avec le rôle associé
    $user = User::create([
        'nom' => $validated['nom'],
        'prenom' => $validated['prenom'],
        'matricule' => $validated['matricule'],
        'mobile' => $validated['mobile'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'role' => $role->role, // Associer le rôle
    ]);

    // Générer un token d'authentification
    $token = $user->createToken('AuthToken')->plainTextToken;

    return response()->json([
        'message' => 'Utilisateur créé avec succès',
        'user' => $user,
        'token' => $token
    ], 201);
}

     // Connexion d'un utilisateur
     public function login(Request $request)
     {
         $request->validate([
             'email' => 'required|string|email',
             'password' => 'required|string',
         ]);

         $user = User::where('email', $request->email)->first();

         if (!$user || !Hash::check($request->password, $user->password)) {
             throw ValidationException::withMessages([
                 'email' => ['Les identifiants sont incorrects.'],
             ]);
         }

         $token = $user->createToken('auth_token')->plainTextToken;

         return response()->json([
             'message' => 'Connexion réussie',
             'token' => $token,
             'user' => $user
         ]);
     }


     public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
public function updateProfile(Request $request, $id)
{
    $user = User::findOrFail($id);

    // Validation des champs
    $validated = $request->validate([
        'nom' => 'nullable|string|max:255',
        'prenom' => 'nullable|string|max:255',
        'matricule' => 'nullable|string|unique:users,matricule,' . $user->id,
        'mobile' => 'nullable|string',
        'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:8|confirmed', // tu peux gérer la confirmation si besoin
        'role' => 'nullable|string|exists:roles,role',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    // Mise à jour des champs classiques
    if ($request->filled('nom')) $user->nom = $validated['nom'];
    if ($request->filled('prenom')) $user->prenom = $validated['prenom'];
    if ($request->filled('matricule')) $user->matricule = $validated['matricule'];
    if ($request->filled('mobile')) $user->mobile = $validated['mobile'];
    if ($request->filled('email')) $user->email = $validated['email'];
    if ($request->filled('role')) $user->role = $validated['role'];
    if ($request->filled('password')) $user->password = Hash::make($validated['password']);

    // Mise à jour de l'image
    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/users'), $filename);

        $user->image = 'uploads/users/' . $filename;
    }

    $user->save();

    return response()->json([
        'message' => 'Profil mis à jour avec succès',
        'user' => $user
    ]);
}



    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
