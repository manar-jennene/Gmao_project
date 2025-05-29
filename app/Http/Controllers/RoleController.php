<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
 // In your Laravel controller
public function index()
{
    $roles = Role::all(); // Make sure this returns a collection/array
    return response()->json($roles); // This will properly format as JSON array
}

    /**
     * Ajouter un nouveau rôle.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'role' => 'required|string'
            ]);

            $role = Role::create([
                'role' => $request->role
            ]);

            return response()->json(['message' => 'Rôle ajouté avec succès', 'role' => $role], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'ajout du rôle', 'message' => $e->getMessage()], 500);
        }
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
    public function update(Request $request, $id)
    {
        //
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
