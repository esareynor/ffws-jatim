@extends('layouts.admin')

@section('title', 'Edit Rating Curve')
@section('page-title', 'Edit Rating Curve')
@section('page-description', 'Update rating curve')

@section('content')
<div class="max-w-4xl mx-auto">
    <x-admin.card>
        <form action="{{ route('admin.rating-curves.update', $ratingCurve['id']) }}" method="POST" class="space-y-6">
            @csrf
            @method('PUT')
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Sensor Selection -->
                <div class="md:col-span-2">
                    <x-admin.form-input 
                        type="select"
                        name="sensor_code" 
                        label="Sensor" 
                        required="true" 
                        :error="$errors->first('sensor_code')"
                        :options="$sensors"
                        :value="$ratingCurve['sensor_code']"
                    />
                </div>

                <!-- Formula Parameters -->
                <div class="md:col-span-2">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Formula Parameters: Q = C × (H - A)^B
                    </h3>
                </div>

                <x-admin.form-input 
                    type="number" 
                    name="coefficient_c" 
                    label="Coefficient (C)" 
                    placeholder="1.0" 
                    step="0.0001"
                    required="true" 
                    :error="$errors->first('coefficient_c')"
                    :value="$ratingCurve['coefficient_c']"
                    help="Coefficient value in the rating curve formula"
                />

                <x-admin.form-input 
                    type="number" 
                    name="exponent_b" 
                    label="Exponent (B)" 
                    placeholder="2.0" 
                    step="0.0001"
                    required="true" 
                    :error="$errors->first('exponent_b')"
                    :value="$ratingCurve['exponent_b']"
                    help="Exponent value in the rating curve formula"
                />

                <x-admin.form-input 
                    type="number" 
                    name="offset_a" 
                    label="Offset (A)" 
                    placeholder="0.0" 
                    step="0.0001"
                    required="true" 
                    :error="$errors->first('offset_a')"
                    :value="$ratingCurve['offset_a']"
                    help="Offset value in the rating curve formula"
                />

                <!-- Validity Period -->
                <div class="md:col-span-2">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-4">
                        Validity Period
                    </h3>
                </div>

                <x-admin.form-input 
                    type="date" 
                    name="valid_from" 
                    label="Valid From" 
                    required="true" 
                    :error="$errors->first('valid_from')"
                    :value="isset($ratingCurve['valid_from']) ? date('Y-m-d', strtotime($ratingCurve['valid_from'])) : ''"
                />

                <x-admin.form-input 
                    type="date" 
                    name="valid_to" 
                    label="Valid To" 
                    :error="$errors->first('valid_to')"
                    :value="isset($ratingCurve['valid_to']) ? date('Y-m-d', strtotime($ratingCurve['valid_to'])) : ''"
                    help="Leave empty for indefinite validity"
                />

                <!-- Status -->
                <div class="md:col-span-2">
                    <x-admin.form-input 
                        type="select"
                        name="is_active" 
                        label="Status" 
                        required="true" 
                        :error="$errors->first('is_active')"
                        :options="[
                            ['value' => '1', 'label' => 'Active'],
                            ['value' => '0', 'label' => 'Inactive']
                        ]"
                        :value="$ratingCurve['is_active'] ? '1' : '0'"
                    />
                </div>

                <!-- Notes -->
                <div class="md:col-span-2">
                    <x-admin.form-input 
                        type="textarea" 
                        name="notes" 
                        label="Notes" 
                        placeholder="Additional notes about this rating curve..." 
                        rows="3"
                        :error="$errors->first('notes')"
                        :value="$ratingCurve['notes'] ?? ''"
                    />
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a href="{{ route('admin.rating-curves.index') }}">
                    <x-admin.button type="button" variant="secondary">
                        <i class="fas fa-times -ml-1 mr-2"></i>
                        Cancel
                    </x-admin.button>
                </a>
                <x-admin.button type="submit" variant="primary">
                    <i class="fas fa-check -ml-1 mr-2"></i>
                    Update Rating Curve
                </x-admin.button>
            </div>
        </form>
    </x-admin.card>
</div>
@endsection

